use anchor_lang::prelude::*;

use crate::{
    errors::YieldVaultError,
    state::{FacilityYieldPool, YieldVault, MAX_FACILITY_ID_LEN},
};

#[derive(Accounts)]
#[instruction(facility_id: String)]
pub struct InitializeFacilityYieldPool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [b"yield_vault"],
        bump = yield_vault.bump,
        has_one = authority @ YieldVaultError::UnauthorizedAdmin,
    )]
    pub yield_vault: Account<'info, YieldVault>,
    /// CHECK: BedRight facility linkage is stored by pubkey in this MVP initializer.
    pub facility: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        space = FacilityYieldPool::LEN,
        seeds = [b"facility_yield_pool", facility_id.as_bytes()],
        bump,
    )]
    pub facility_yield_pool: Account<'info, FacilityYieldPool>,
    pub system_program: Program<'info, System>,
}

/// 作用：初始化设施级收益池账户，并写入基础统计字段。
/// 请求参数：`ctx` 为管理员、设施和收益池账户上下文，`facility_id` 为设施业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(ctx: Context<InitializeFacilityYieldPool>, facility_id: String) -> Result<()> {
    require!(
        !facility_id.is_empty() && facility_id.len() <= MAX_FACILITY_ID_LEN,
        YieldVaultError::InvalidFacility
    );

    let pool = &mut ctx.accounts.facility_yield_pool;

    pool.facility_id = facility_id;
    pool.facility = ctx.accounts.facility.key();
    pool.admin_wallet = ctx.accounts.authority.key();
    pool.total_deposited_lamports = 0;
    pool.total_allocated_lamports = 0;
    pool.total_claimed_lamports = 0;
    pool.pending_unallocated_lamports = 0;
    pool.last_deposit_ts = 0;
    pool.bump = ctx.bumps.facility_yield_pool;

    Ok(())
}
