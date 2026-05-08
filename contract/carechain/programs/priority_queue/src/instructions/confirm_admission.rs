use anchor_lang::prelude::*;

use crate::{
    errors::QueueError,
    state::{
        parse_bed_position, BedRightBedPosition, QueueEntry, QueueState, QueueStatus,
        MAX_APPLICANT_ID_LEN,
    },
    AdmissionConfirmed,
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct ConfirmAdmission<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"queue_state", facility_id.as_bytes()],
        bump = queue_state.bump,
    )]
    pub queue_state: Account<'info, QueueState>,
    #[account(
        mut,
        seeds = [b"queue_entry", facility_id.as_bytes(), applicant_id.as_bytes()],
        bump = queue_entry.bump,
    )]
    pub queue_entry: Account<'info, QueueEntry>,
    /// CHECK: validated in handler
    pub bedright_program: UncheckedAccount<'info>,
    /// CHECK: validated in handler
    pub bed_position: UncheckedAccount<'info>,
}

fn validate_bed_position_for_admission(
    queue_state: &QueueState,
    facility_id: &str,
    parsed_bed_position: &BedRightBedPosition,
) -> Result<()> {
    require!(
        parsed_bed_position.active,
        QueueError::InvalidBedPosition
    );
    require!(
        parsed_bed_position.facility == queue_state.facility
            && parsed_bed_position.facility_id == facility_id,
        QueueError::InvalidBedRightFacility
    );

    Ok(())
}

fn apply_confirm_admission(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    facility_id: &str,
    applicant_id: &str,
    admin: Pubkey,
    bed_position: Pubkey,
    admitted_at: i64,
) -> Result<()> {
    require!(
        !facility_id.is_empty() && queue_state.facility_id == facility_id,
        QueueError::InvalidFacility
    );
    require!(
        !applicant_id.is_empty()
            && applicant_id.len() <= MAX_APPLICANT_ID_LEN
            && queue_entry.applicant_id == applicant_id,
        QueueError::InvalidApplicantId
    );
    require!(
        queue_entry.facility_id == facility_id,
        QueueError::InvalidFacility
    );
    require!(
        queue_state.admin_wallet == admin,
        QueueError::UnauthorizedAdmin
    );
    require!(
        queue_entry.status == QueueStatus::Invited,
        QueueError::ApplicantNotInvited
    );

    queue_entry.bed_position = Some(bed_position);
    queue_entry.status = QueueStatus::Admitted;
    queue_entry.updated_at = admitted_at;
    queue_state.updated_at = admitted_at;

    Ok(())
}

/// 作用：由管理员确认入住，校验床位归属后将条目标记为已入住。
/// 请求参数：`ctx` 为管理员、床位和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<ConfirmAdmission>,
    facility_id: String,
    applicant_id: String,
) -> Result<()> {
    require!(
        ctx.accounts.bed_position.owner == &ctx.accounts.bedright_program.key(),
        QueueError::InvalidBedPosition
    );
    let parsed_bed_position = parse_bed_position(&ctx.accounts.bed_position)?;

    let now = Clock::get()?.unix_timestamp;
    let admin = ctx.accounts.admin.key();
    let bed_position = ctx.accounts.bed_position.key();
    let queue_state = &mut ctx.accounts.queue_state;
    validate_bed_position_for_admission(queue_state, &facility_id, &parsed_bed_position)?;
    let queue_entry = &mut ctx.accounts.queue_entry;
    apply_confirm_admission(
        queue_state,
        queue_entry,
        &facility_id,
        &applicant_id,
        admin,
        bed_position,
        now,
    )?;

    emit!(AdmissionConfirmed {
        facility_id,
        applicant_id,
        bed_position,
        timestamp: now,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::{BedRightBedMode, QueueLane, QueueStatus};

    fn queue_state_fixture() -> QueueState {
        QueueState {
            facility_id: "facility-1".to_string(),
            facility: Pubkey::new_unique(),
            admin_wallet: Pubkey::new_unique(),
            p1_count: 1,
            p2_count: 0,
            p3_count: 0,
            next_queue_no: 3,
            multiplier_bps: 10_000,
            burn_price_per_day: 10,
            updated_at: 0,
            bump: 2,
        }
    }

    fn invited_entry() -> QueueEntry {
        QueueEntry {
            applicant_id: "applicant-1".to_string(),
            facility_id: "facility-1".to_string(),
            wallet: Some(Pubkey::new_unique()),
            mint: Some(Pubkey::new_unique()),
            lane: QueueLane::P1,
            queue_no: 0,
            burn_amount: 0,
            status: QueueStatus::Invited,
            bed_position: None,
            created_at: 1_700_000_000,
            updated_at: 1_700_000_010,
            bump: 8,
        }
    }

    fn bed_position_fixture(queue_state: &QueueState) -> BedRightBedPosition {
        BedRightBedPosition {
            owner: Pubkey::new_unique(),
            mint: Pubkey::new_unique(),
            facility: queue_state.facility,
            bed_class: Pubkey::new_unique(),
            facility_id: queue_state.facility_id.clone(),
            bed_class_id: "class-1".to_string(),
            mode: BedRightBedMode::Occupancy,
            last_mode_switch_ts: 1_700_000_000,
            active: true,
            bump: 3,
        }
    }

    #[test]
    fn confirm_admission_sets_bed_position_and_marks_entry_admitted() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = invited_entry();
        let bed_position = Pubkey::new_unique();
        let admin = queue_state.admin_wallet;

        super::apply_confirm_admission(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            admin,
            bed_position,
            1_700_000_100,
        )
        .expect("confirmation should succeed");

        assert!(matches!(queue_entry.status, QueueStatus::Admitted));
        assert_eq!(queue_entry.bed_position, Some(bed_position));
        assert_eq!(queue_entry.updated_at, 1_700_000_100);
        assert_eq!(queue_state.updated_at, 1_700_000_100);
    }

    #[test]
    fn confirm_admission_rejects_non_invited_entries() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = invited_entry();
        let admin = queue_state.admin_wallet;
        queue_entry.status = QueueStatus::Waiting;

        let err = super::apply_confirm_admission(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            admin,
            Pubkey::new_unique(),
            1_700_000_100,
        )
        .expect_err("waiting entry must fail");

        assert_eq!(err, QueueError::ApplicantNotInvited.into());
    }

    #[test]
    fn validate_bed_position_for_admission_accepts_matching_facility() {
        let queue_state = queue_state_fixture();
        let bed_position = bed_position_fixture(&queue_state);

        super::validate_bed_position_for_admission(&queue_state, "facility-1", &bed_position)
            .expect("matching facility should pass");
    }

    #[test]
    fn validate_bed_position_for_admission_rejects_wrong_facility() {
        let queue_state = queue_state_fixture();
        let mut bed_position = bed_position_fixture(&queue_state);
        bed_position.facility_id = "facility-2".to_string();

        let err =
            super::validate_bed_position_for_admission(&queue_state, "facility-1", &bed_position)
                .expect_err("facility mismatch must fail");

        assert_eq!(err, QueueError::InvalidBedRightFacility.into());
    }

    #[test]
    fn validate_bed_position_for_admission_rejects_inactive_bed_position() {
        let queue_state = queue_state_fixture();
        let mut bed_position = bed_position_fixture(&queue_state);
        bed_position.active = false;

        let err =
            super::validate_bed_position_for_admission(&queue_state, "facility-1", &bed_position)
                .expect_err("inactive bed position must fail");

        assert_eq!(err, QueueError::InvalidBedPosition.into());
    }
}
