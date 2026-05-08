use anchor_lang::{prelude::*, system_program};

use crate::{
    errors::YieldVaultError,
    state::{
        FacilityYieldPool, YieldDistributionRecord, YieldSource, YieldVault, MAX_FACILITY_ID_LEN,
    },
    YieldDeposited,
};

#[derive(Accounts)]
#[instruction(facility_id: String, _amount_lamports: u64, _source: YieldSource, snapshot_id: String)]
pub struct DepositYield<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"yield_vault"],
        bump = yield_vault.bump,
        has_one = authority @ YieldVaultError::UnauthorizedAdmin,
    )]
    pub yield_vault: Account<'info, YieldVault>,
    /// CHECK: constrained by `has_one = authority`
    pub authority: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"facility_yield_pool", facility_id.as_bytes()],
        bump = facility_yield_pool.bump,
    )]
    pub facility_yield_pool: Account<'info, FacilityYieldPool>,
    #[account(
        init,
        payer = admin,
        space = YieldDistributionRecord::LEN,
        seeds = [b"yield_distribution", snapshot_id.as_bytes()],
        bump,
    )]
    pub yield_distribution_record: Account<'info, YieldDistributionRecord>,
    pub system_program: Program<'info, System>,
}

/// 作用：向设施收益池注入原生 SOL，并生成对应的收益分账批次记录。
/// 请求参数：`ctx` 为管理员、收益池和批次账户上下文，`facility_id` 为设施业务 ID，`amount_lamports` 为注资金额，`source` 为收益来源，`snapshot_id` 为批次快照 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<DepositYield>,
    facility_id: String,
    amount_lamports: u64,
    source: YieldSource,
    snapshot_id: String,
) -> Result<()> {
    require!(amount_lamports > 0, YieldVaultError::AmountMustBePositive);
    require!(
        !facility_id.is_empty() && facility_id.len() <= MAX_FACILITY_ID_LEN,
        YieldVaultError::InvalidFacility
    );
    require!(
        !snapshot_id.is_empty()
            && snapshot_id.len() <= YieldDistributionRecord::MAX_SNAPSHOT_ID_LEN,
        YieldVaultError::InvalidSnapshotId
    );
    require!(
        ctx.accounts.facility_yield_pool.admin_wallet == ctx.accounts.admin.key(),
        YieldVaultError::UnauthorizedAdmin
    );
    require!(
        ctx.accounts.facility_yield_pool.facility_id == facility_id,
        YieldVaultError::InvalidFacility
    );

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.admin.to_account_info(),
                to: ctx.accounts.yield_vault.to_account_info(),
            },
        ),
        amount_lamports,
    )?;

    let pool = &mut ctx.accounts.facility_yield_pool;
    pool.total_deposited_lamports = pool
        .total_deposited_lamports
        .checked_add(amount_lamports)
        .ok_or(YieldVaultError::MathOverflow)?;
    pool.pending_unallocated_lamports = pool
        .pending_unallocated_lamports
        .checked_add(amount_lamports)
        .ok_or(YieldVaultError::MathOverflow)?;
    pool.last_deposit_ts = Clock::get()?.unix_timestamp;

    let record = &mut ctx.accounts.yield_distribution_record;
    record.snapshot_id = snapshot_id.clone();
    record.facility_id = facility_id.clone();
    record.source = source;
    record.amount_lamports = amount_lamports;
    record.distributed_position_count = 0;
    record.created_by = ctx.accounts.admin.key();
    record.created_at = pool.last_deposit_ts;
    record.bump = ctx.bumps.yield_distribution_record;

    emit!(YieldDeposited {
        snapshot_id,
        facility_id,
        admin: ctx.accounts.admin.key(),
        amount_lamports,
        source: source as u8,
        timestamp: pool.last_deposit_ts,
    });

    Ok(())
}
