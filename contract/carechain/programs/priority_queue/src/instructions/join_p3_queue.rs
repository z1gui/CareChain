use anchor_lang::prelude::*;

use crate::{
    errors::QueueError,
    initialize_queue::refresh_pricing,
    state::{QueueEntry, QueueLane, QueueState, QueueStatus, MAX_APPLICANT_ID_LEN},
    PricingUpdated, QueueJoined,
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct JoinP3Queue<'info> {
    #[account(mut)]
    pub applicant: Signer<'info>,
    #[account(
        mut,
        seeds = [b"queue_state", facility_id.as_bytes()],
        bump = queue_state.bump,
    )]
    pub queue_state: Account<'info, QueueState>,
    #[account(
        init,
        payer = applicant,
        space = QueueEntry::LEN,
        seeds = [b"queue_entry", facility_id.as_bytes(), applicant_id.as_bytes()],
        bump,
    )]
    pub queue_entry: Account<'info, QueueEntry>,
    pub system_program: Program<'info, System>,
}

struct JoinP3Result {
    queue_no: u64,
    joined_at: i64,
}

fn apply_join_p3(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    facility_id: String,
    applicant_id: String,
    wallet: Pubkey,
    joined_at: i64,
    entry_bump: u8,
) -> Result<JoinP3Result> {
    require!(
        !facility_id.is_empty() && queue_state.facility_id == facility_id,
        QueueError::InvalidFacility
    );
    require!(
        !applicant_id.is_empty() && applicant_id.len() <= MAX_APPLICANT_ID_LEN,
        QueueError::InvalidApplicantId
    );
    let queue_no = queue_state.next_queue_no;
    queue_state.next_queue_no = queue_state
        .next_queue_no
        .checked_add(1)
        .ok_or(QueueError::MathOverflow)?;
    queue_state.p3_count = queue_state
        .p3_count
        .checked_add(1)
        .ok_or(QueueError::MathOverflow)?;
    queue_state.updated_at = joined_at;
    refresh_pricing(queue_state);

    queue_entry.applicant_id = applicant_id;
    queue_entry.facility_id = facility_id;
    queue_entry.wallet = Some(wallet);
    queue_entry.mint = None;
    queue_entry.lane = QueueLane::P3;
    queue_entry.queue_no = queue_no;
    queue_entry.burn_amount = 0;
    queue_entry.status = QueueStatus::Waiting;
    queue_entry.bed_position = None;
    queue_entry.created_at = joined_at;
    queue_entry.updated_at = joined_at;
    queue_entry.bump = entry_bump;

    Ok(JoinP3Result {
        queue_no,
        joined_at,
    })
}

/// 作用：创建新的 P3 排队条目，并递增队列编号及 P3 计数。
/// 请求参数：`ctx` 为申请人和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(ctx: Context<JoinP3Queue>, facility_id: String, applicant_id: String) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    let queue_state = &mut ctx.accounts.queue_state;
    let queue_entry = &mut ctx.accounts.queue_entry;
    let wallet = ctx.accounts.applicant.key();
    let result = apply_join_p3(
        queue_state,
        queue_entry,
        facility_id.clone(),
        applicant_id.clone(),
        wallet,
        now,
        ctx.bumps.queue_entry,
    )?;

    emit!(QueueJoined {
        facility_id: facility_id.clone(),
        applicant_id: applicant_id.clone(),
        wallet,
        lane: QueueLane::P3 as u8,
        queue_no: result.queue_no,
        timestamp: result.joined_at,
    });

    emit!(PricingUpdated {
        facility_id,
        p3_count: queue_state.p3_count,
        multiplier_bps: queue_state.multiplier_bps,
        burn_price_per_day: queue_state.burn_price_per_day,
        timestamp: queue_state.updated_at,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn queue_state_fixture() -> QueueState {
        QueueState {
            facility_id: "facility-1".to_string(),
            facility: Pubkey::default(),
            admin_wallet: Pubkey::default(),
            p1_count: 0,
            p2_count: 0,
            p3_count: 9,
            next_queue_no: 42,
            multiplier_bps: 10_000,
            burn_price_per_day: 10,
            updated_at: 0,
            bump: 7,
        }
    }

    fn empty_queue_entry() -> QueueEntry {
        QueueEntry {
            applicant_id: String::new(),
            facility_id: String::new(),
            wallet: None,
            mint: None,
            lane: QueueLane::P3,
            queue_no: 0,
            burn_amount: 0,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 0,
            updated_at: 0,
            bump: 0,
        }
    }

    #[test]
    fn apply_join_p3_assigns_queue_number_updates_counts_and_refreshes_pricing() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = empty_queue_entry();
        let joined_at = 1_700_000_000;
        let wallet = Pubkey::new_unique();

        let result = apply_join_p3(
            &mut queue_state,
            &mut queue_entry,
            "facility-1".to_string(),
            "applicant-1".to_string(),
            wallet,
            joined_at,
            3,
        )
        .expect("join should succeed");

        assert_eq!(result.queue_no, 42);
        assert_eq!(queue_entry.queue_no, 42);
        assert_eq!(queue_entry.wallet, Some(wallet));
        assert_eq!(queue_state.next_queue_no, 43);
        assert_eq!(queue_state.p3_count, 10);
        assert_eq!(queue_state.multiplier_bps, 15_000);
        assert_eq!(queue_state.burn_price_per_day, 15);
        assert_eq!(queue_state.updated_at, joined_at);
    }
}
