use anchor_lang::prelude::*;

use crate::{
    errors::QueueError,
    state::{QueueState, MAX_FACILITY_ID_LEN},
};

#[derive(Accounts)]
#[instruction(facility_id: String)]
pub struct InitializeQueue<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: stored as facility pubkey in MVP
    pub facility: UncheckedAccount<'info>,
    #[account(
        init,
        payer = admin,
        space = QueueState::LEN,
        seeds = [b"queue_state", facility_id.as_bytes()],
        bump,
    )]
    pub queue_state: Account<'info, QueueState>,
    pub system_program: Program<'info, System>,
}

/// 作用：初始化设施级 `QueueState`，写入管理员、设施和初始定价信息。
/// 请求参数：`ctx` 为管理员和队列状态账户上下文，`facility_id` 为设施业务 ID，`burn_price_per_day` 为初始每日燃烧价格。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<InitializeQueue>,
    facility_id: String,
    burn_price_per_day: u64,
) -> Result<()> {
    require!(
        !facility_id.is_empty() && facility_id.len() <= MAX_FACILITY_ID_LEN,
        QueueError::InvalidFacility
    );

    let queue_state = &mut ctx.accounts.queue_state;
    queue_state.facility_id = facility_id;
    queue_state.facility = ctx.accounts.facility.key();
    queue_state.admin_wallet = ctx.accounts.admin.key();
    queue_state.p1_count = 0;
    queue_state.p2_count = 0;
    queue_state.p3_count = 0;
    queue_state.next_queue_no = 1;
    queue_state.multiplier_bps = 10_000;
    queue_state.burn_price_per_day = burn_price_per_day;
    queue_state.updated_at = Clock::get()?.unix_timestamp;
    queue_state.bump = ctx.bumps.queue_state;

    Ok(())
}

/// 作用：根据当前 P3 排队人数刷新链上价格倍率和每日燃烧价格。
/// 请求参数：`queue_state` 为待更新的队列总状态账户。
/// 返回参数：无显式返回值，直接原地修改 `queue_state`。
pub fn refresh_pricing(queue_state: &mut QueueState) {
    if queue_state.p3_count < 10 {
        queue_state.multiplier_bps = 10_000;
        queue_state.burn_price_per_day = 10;
    } else if queue_state.p3_count <= 50 {
        queue_state.multiplier_bps = 15_000;
        queue_state.burn_price_per_day = 15;
    } else {
        queue_state.multiplier_bps = 20_000;
        queue_state.burn_price_per_day = 20;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn queue_state_with_p3_count(p3_count: u32) -> QueueState {
        QueueState {
            facility_id: "facility-1".to_string(),
            facility: Pubkey::default(),
            admin_wallet: Pubkey::default(),
            p1_count: 0,
            p2_count: 0,
            p3_count,
            next_queue_no: 1,
            multiplier_bps: 0,
            burn_price_per_day: 0,
            updated_at: 0,
            bump: 0,
        }
    }

    #[test]
    fn refresh_pricing_uses_base_rate_below_ten_p3_entries() {
        let mut queue_state = queue_state_with_p3_count(9);

        refresh_pricing(&mut queue_state);

        assert_eq!(queue_state.multiplier_bps, 10_000);
        assert_eq!(queue_state.burn_price_per_day, 10);
    }

    #[test]
    fn refresh_pricing_uses_mid_rate_for_ten_through_fifty_p3_entries() {
        let mut queue_state = queue_state_with_p3_count(10);

        refresh_pricing(&mut queue_state);

        assert_eq!(queue_state.multiplier_bps, 15_000);
        assert_eq!(queue_state.burn_price_per_day, 15);
    }

    #[test]
    fn refresh_pricing_uses_high_rate_above_fifty_p3_entries() {
        let mut queue_state = queue_state_with_p3_count(51);

        refresh_pricing(&mut queue_state);

        assert_eq!(queue_state.multiplier_bps, 20_000);
        assert_eq!(queue_state.burn_price_per_day, 20);
    }
}
