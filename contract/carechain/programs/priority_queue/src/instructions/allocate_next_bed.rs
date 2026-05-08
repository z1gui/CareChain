use anchor_lang::prelude::*;

use crate::{
    errors::QueueError,
    initialize_queue::refresh_pricing,
    state::{QueueEntry, QueueLane, QueueState, QueueStatus, MAX_APPLICANT_ID_LEN},
    BedAllocated, PricingUpdated,
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct AllocateNextBed<'info> {
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
}

#[derive(Debug)]
struct AllocateNextBedResult {
    timestamp: i64,
    pricing_updated: bool,
}

fn apply_allocate_next_bed(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    facility_id: &str,
    applicant_id: &str,
    admin: Pubkey,
    allocated_at: i64,
) -> Result<AllocateNextBedResult> {
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
        queue_entry.status == QueueStatus::Waiting,
        QueueError::ApplicantNotWaiting
    );

    let pricing_updated = match queue_entry.lane {
        QueueLane::P1 => {
            queue_state.p1_count = queue_state
                .p1_count
                .checked_sub(1)
                .ok_or(QueueError::MathOverflow)?;
            false
        }
        QueueLane::P2 => {
            queue_state.p2_count = queue_state
                .p2_count
                .checked_sub(1)
                .ok_or(QueueError::MathOverflow)?;
            false
        }
        QueueLane::P3 => {
            queue_state.p3_count = queue_state
                .p3_count
                .checked_sub(1)
                .ok_or(QueueError::MathOverflow)?;
            let old_multiplier_bps = queue_state.multiplier_bps;
            let old_burn_price_per_day = queue_state.burn_price_per_day;
            refresh_pricing(queue_state);
            queue_state.multiplier_bps != old_multiplier_bps
                || queue_state.burn_price_per_day != old_burn_price_per_day
        }
    };

    queue_entry.status = QueueStatus::Invited;
    queue_entry.updated_at = allocated_at;
    queue_state.updated_at = allocated_at;

    Ok(AllocateNextBedResult {
        timestamp: allocated_at,
        pricing_updated,
    })
}

/// 作用：由管理员将指定等待中的排队条目标记为已邀请入住。
/// 请求参数：`ctx` 为管理员和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<AllocateNextBed>,
    facility_id: String,
    applicant_id: String,
) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    let admin = ctx.accounts.admin.key();
    let queue_state = &mut ctx.accounts.queue_state;
    let queue_entry = &mut ctx.accounts.queue_entry;
    let result = apply_allocate_next_bed(
        queue_state,
        queue_entry,
        &facility_id,
        &applicant_id,
        admin,
        now,
    )?;

    emit!(BedAllocated {
        facility_id: facility_id.clone(),
        applicant_id: applicant_id.clone(),
        lane: queue_entry.lane as u8,
        status: queue_entry.status as u8,
        timestamp: result.timestamp,
    });

    if result.pricing_updated {
        emit!(PricingUpdated {
            facility_id,
            p3_count: queue_state.p3_count,
            multiplier_bps: queue_state.multiplier_bps,
            burn_price_per_day: queue_state.burn_price_per_day,
            timestamp: queue_state.updated_at,
        });
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::{QueueLane, QueueStatus};

    fn queue_state_fixture() -> QueueState {
        QueueState {
            facility_id: "facility-1".to_string(),
            facility: Pubkey::new_unique(),
            admin_wallet: Pubkey::new_unique(),
            p1_count: 2,
            p2_count: 3,
            p3_count: 10,
            next_queue_no: 50,
            multiplier_bps: 15_000,
            burn_price_per_day: 15,
            updated_at: 0,
            bump: 1,
        }
    }

    fn waiting_entry(lane: QueueLane, wallet: Pubkey) -> QueueEntry {
        QueueEntry {
            applicant_id: "applicant-1".to_string(),
            facility_id: "facility-1".to_string(),
            wallet: Some(wallet),
            mint: None,
            lane,
            queue_no: 12,
            burn_amount: 0,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 1_700_000_000,
            updated_at: 1_700_000_010,
            bump: 9,
        }
    }

    #[test]
    fn allocate_next_bed_moves_waiting_entry_to_invited_and_updates_counts() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_entry(QueueLane::P3, Pubkey::new_unique());
        let admin = queue_state.admin_wallet;

        let result = super::apply_allocate_next_bed(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            admin,
            1_700_000_100,
        )
        .expect("allocation should succeed");

        assert!(matches!(queue_entry.status, QueueStatus::Invited));
        assert_eq!(queue_entry.updated_at, 1_700_000_100);
        assert_eq!(queue_state.p3_count, 9);
        assert_eq!(queue_state.multiplier_bps, 10_000);
        assert_eq!(queue_state.burn_price_per_day, 10);
        assert!(result.pricing_updated);
    }

    #[test]
    fn allocate_next_bed_rejects_non_waiting_entries() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_entry(QueueLane::P2, Pubkey::new_unique());
        let admin = queue_state.admin_wallet;
        queue_entry.status = QueueStatus::Invited;

        let err = super::apply_allocate_next_bed(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            admin,
            1_700_000_100,
        )
        .expect_err("non-waiting entry must fail");

        assert_eq!(err, QueueError::ApplicantNotWaiting.into());
    }
}
