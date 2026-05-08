use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};

use crate::{
    errors::QueueError,
    initialize_queue::refresh_pricing,
    state::{QueueEntry, QueueLane, QueueState, QueueStatus, MAX_APPLICANT_ID_LEN},
    PricingUpdated, QueueUpgraded,
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct BurnCareAndUpgrade<'info> {
    #[account(mut)]
    pub applicant: Signer<'info>,
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
    pub care_mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = user_care_ata.owner == applicant.key() @ QueueError::UnauthorizedApplicant,
        constraint = user_care_ata.mint == care_mint.key() @ QueueError::InvalidCareMint,
    )]
    pub user_care_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Debug)]
struct UpgradeResult {
    timestamp: i64,
}

fn apply_burn_care_and_upgrade(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    facility_id: &str,
    applicant_id: &str,
    signer: Pubkey,
    burn_amount: u64,
    upgraded_at: i64,
) -> Result<UpgradeResult> {
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
    require!(burn_amount > 0, QueueError::BurnAmountMustBePositive);
    require!(
        queue_entry.wallet == Some(signer),
        QueueError::UnauthorizedApplicant
    );
    require!(queue_entry.lane == QueueLane::P3, QueueError::ApplicantNotInP3);
    require!(
        queue_entry.status == QueueStatus::Waiting,
        QueueError::ApplicantNotWaiting
    );

    queue_entry.burn_amount = queue_entry
        .burn_amount
        .checked_add(burn_amount)
        .ok_or(QueueError::MathOverflow)?;
    queue_entry.lane = QueueLane::P2;
    queue_entry.updated_at = upgraded_at;

    queue_state.p3_count = queue_state
        .p3_count
        .checked_sub(1)
        .ok_or(QueueError::MathOverflow)?;
    queue_state.p2_count = queue_state
        .p2_count
        .checked_add(1)
        .ok_or(QueueError::MathOverflow)?;
    queue_state.updated_at = upgraded_at;
    refresh_pricing(queue_state);

    Ok(UpgradeResult {
        timestamp: upgraded_at,
    })
}

/// 作用：燃烧用户的 CARE 代币，并将目标排队条目从 P3 升级为 P2。
/// 请求参数：`ctx` 为申请人、CARE 代币和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID，`burn_amount` 为燃烧数量。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<BurnCareAndUpgrade>,
    facility_id: String,
    applicant_id: String,
    burn_amount: u64,
) -> Result<()> {
    require!(
        ctx.accounts.user_care_ata.amount >= burn_amount,
        QueueError::InsufficientCareBalance
    );

    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.care_mint.to_account_info(),
                from: ctx.accounts.user_care_ata.to_account_info(),
                authority: ctx.accounts.applicant.to_account_info(),
            },
        ),
        burn_amount,
    )?;

    let queue_state = &mut ctx.accounts.queue_state;
    let queue_entry = &mut ctx.accounts.queue_entry;
    let applicant = ctx.accounts.applicant.key();
    let now = Clock::get()?.unix_timestamp;
    let result = apply_burn_care_and_upgrade(
        queue_state,
        queue_entry,
        &facility_id,
        &applicant_id,
        applicant,
        burn_amount,
        now,
    )?;

    emit!(QueueUpgraded {
        facility_id: facility_id.clone(),
        applicant_id: applicant_id.clone(),
        wallet: applicant,
        old_lane: QueueLane::P3 as u8,
        new_lane: QueueLane::P2 as u8,
        burn_amount,
        timestamp: result.timestamp,
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
            facility: Pubkey::new_unique(),
            admin_wallet: Pubkey::new_unique(),
            p1_count: 0,
            p2_count: 3,
            p3_count: 10,
            next_queue_no: 11,
            multiplier_bps: 15_000,
            burn_price_per_day: 15,
            updated_at: 0,
            bump: 2,
        }
    }

    fn waiting_p3_entry() -> QueueEntry {
        QueueEntry {
            applicant_id: "applicant-1".to_string(),
            facility_id: "facility-1".to_string(),
            wallet: Some(Pubkey::new_unique()),
            mint: None,
            lane: QueueLane::P3,
            queue_no: 7,
            burn_amount: 5,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 1_700_000_000,
            updated_at: 1_700_000_010,
            bump: 9,
        }
    }

    #[test]
    fn upgrade_from_p3_to_p2_updates_counts_burn_total_and_pricing() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_p3_entry();
        let signer = queue_entry.wallet.expect("wallet present");
        let now = 1_700_000_100;

        let result = apply_burn_care_and_upgrade(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            signer,
            12,
            now,
        )
        .expect("upgrade should succeed");

        assert_eq!(result.timestamp, now);
        assert!(matches!(queue_entry.lane, QueueLane::P2));
        assert_eq!(queue_entry.burn_amount, 17);
        assert_eq!(queue_state.p3_count, 9);
        assert_eq!(queue_state.p2_count, 4);
        assert_eq!(queue_state.multiplier_bps, 10_000);
        assert_eq!(queue_state.burn_price_per_day, 10);
        assert_eq!(queue_state.updated_at, now);
        assert_eq!(queue_entry.updated_at, now);
    }

    #[test]
    fn upgrade_rejects_zero_burn_amount() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_p3_entry();
        let signer = queue_entry.wallet.expect("wallet present");

        let err = apply_burn_care_and_upgrade(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            signer,
            0,
            1_700_000_100,
        )
        .expect_err("zero burn amount must fail");

        assert_eq!(err, QueueError::BurnAmountMustBePositive.into());
    }

    #[test]
    fn upgrade_rejects_non_waiting_or_non_p3_entries() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_p3_entry();
        let signer = queue_entry.wallet.expect("wallet present");
        queue_entry.lane = QueueLane::P2;

        let lane_err = apply_burn_care_and_upgrade(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            signer,
            5,
            1_700_000_100,
        )
        .expect_err("non-p3 entry must fail");

        assert_eq!(lane_err, QueueError::ApplicantNotInP3.into());

        queue_entry.lane = QueueLane::P3;
        queue_entry.status = QueueStatus::Invited;

        let status_err = apply_burn_care_and_upgrade(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            signer,
            5,
            1_700_000_100,
        )
        .expect_err("non-waiting entry must fail");

        assert_eq!(status_err, QueueError::ApplicantNotWaiting.into());
    }

    #[test]
    fn upgrade_rejects_wallet_mismatches() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = waiting_p3_entry();

        let err = apply_burn_care_and_upgrade(
            &mut queue_state,
            &mut queue_entry,
            "facility-1",
            "applicant-1",
            Pubkey::new_unique(),
            5,
            1_700_000_100,
        )
        .expect_err("wallet mismatch must fail");

        assert_eq!(err, QueueError::UnauthorizedApplicant.into());
    }
}
