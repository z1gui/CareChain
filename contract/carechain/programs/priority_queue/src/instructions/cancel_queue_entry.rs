use anchor_lang::prelude::*;

use crate::{
    errors::QueueError,
    initialize_queue::refresh_pricing,
    state::{QueueEntry, QueueLane, QueueState, QueueStatus, MAX_APPLICANT_ID_LEN},
    PricingUpdated,
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct CancelQueueEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
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
struct CancelQueueEntryResult {
    pricing_updated: bool,
}

fn apply_cancel_queue_entry(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    facility_id: &str,
    applicant_id: &str,
    signer: Pubkey,
    cancelled_at: i64,
) -> Result<CancelQueueEntryResult> {
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
        queue_state.admin_wallet == signer || queue_entry.wallet == Some(signer),
        QueueError::UnauthorizedApplicant
    );

    let pricing_updated = if queue_entry.status == QueueStatus::Waiting {
        match queue_entry.lane {
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
        }
    } else {
        false
    };

    queue_entry.status = QueueStatus::Cancelled;
    queue_entry.updated_at = cancelled_at;
    queue_state.updated_at = cancelled_at;

    Ok(CancelQueueEntryResult { pricing_updated })
}

/// 作用：取消目标排队条目，并在必要时回收等待计数和刷新价格。
/// 请求参数：`ctx` 为调用者和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<CancelQueueEntry>,
    facility_id: String,
    applicant_id: String,
) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    let signer = ctx.accounts.signer.key();
    let queue_state = &mut ctx.accounts.queue_state;
    let queue_entry = &mut ctx.accounts.queue_entry;
    let result = apply_cancel_queue_entry(
        queue_state,
        queue_entry,
        &facility_id,
        &applicant_id,
        signer,
        now,
    )?;

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
            p1_count: 1,
            p2_count: 2,
            p3_count: 10,
            next_queue_no: 99,
            multiplier_bps: 15_000,
            burn_price_per_day: 15,
            updated_at: 0,
            bump: 6,
        }
    }

    fn waiting_entry(lane: QueueLane, wallet: Pubkey) -> QueueEntry {
        QueueEntry {
            applicant_id: "applicant-1".to_string(),
            facility_id: "facility-1".to_string(),
            wallet: Some(wallet),
            mint: None,
            lane,
            queue_no: 17,
            burn_amount: 4,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 1_700_000_000,
            updated_at: 1_700_000_010,
            bump: 5,
        }
    }

    #[test]
    fn cancel_queue_entry_by_applicant_decrements_waiting_p3_and_refreshes_pricing() {
        let mut queue_state = queue_state_fixture();
        let signer = Pubkey::new_unique();
        let mut queue_entry = waiting_entry(QueueLane::P3, signer);

        let result = super::apply_cancel_queue_entry(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            signer,
            1_700_000_100,
        )
        .expect("cancel should succeed");

        assert!(matches!(queue_entry.status, QueueStatus::Cancelled));
        assert_eq!(queue_state.p3_count, 9);
        assert_eq!(queue_state.multiplier_bps, 10_000);
        assert_eq!(queue_state.burn_price_per_day, 10);
        assert!(result.pricing_updated);
    }

    #[test]
    fn cancel_queue_entry_allows_admin_and_skips_count_change_for_non_waiting_entries() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_entry(QueueLane::P2, Pubkey::new_unique());
        let admin = queue_state.admin_wallet;
        queue_entry.status = QueueStatus::Invited;

        let result = super::apply_cancel_queue_entry(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            admin,
            1_700_000_100,
        )
        .expect("admin cancel should succeed");

        assert!(matches!(queue_entry.status, QueueStatus::Cancelled));
        assert_eq!(queue_state.p2_count, 2);
        assert!(!result.pricing_updated);
    }

    #[test]
    fn cancel_queue_entry_rejects_unauthorized_signers() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_entry(QueueLane::P1, Pubkey::new_unique());

        let err = super::apply_cancel_queue_entry(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            Pubkey::new_unique(),
            1_700_000_100,
        )
        .expect_err("unauthorized signer must fail");

        assert_eq!(err, QueueError::UnauthorizedApplicant.into());
    }
}
