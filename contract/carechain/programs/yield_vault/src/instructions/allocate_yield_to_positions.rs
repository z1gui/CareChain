use anchor_lang::prelude::*;

use crate::{
    errors::YieldVaultError,
    state::{FacilityYieldPool, YieldDistributionRecord, YieldPosition, MAX_FACILITY_ID_LEN},
    YieldAllocated,
};

#[derive(Accounts)]
#[instruction(facility_id: String, snapshot_id: String, _amount_lamports: u64)]
pub struct AllocateYieldToPosition<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"facility_yield_pool", facility_id.as_bytes()],
        bump = facility_yield_pool.bump,
    )]
    pub facility_yield_pool: Account<'info, FacilityYieldPool>,
    #[account(
        mut,
        seeds = [b"yield_distribution", snapshot_id.as_bytes()],
        bump = yield_distribution_record.bump,
    )]
    pub yield_distribution_record: Account<'info, YieldDistributionRecord>,
    #[account(
        mut,
        seeds = [b"yield_position", yield_position.mint.as_ref()],
        bump = yield_position.bump,
    )]
    pub yield_position: Account<'info, YieldPosition>,
}

/// 作用：将某个收益批次中的金额分配到指定 NFT 的收益仓位。
/// 请求参数：`ctx` 为管理员、收益池、分账批次和收益仓位账户上下文，`facility_id` 为设施业务 ID，`snapshot_id` 为批次快照 ID，`amount_lamports` 为本次分配金额。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<AllocateYieldToPosition>,
    facility_id: String,
    snapshot_id: String,
    amount_lamports: u64,
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
    require!(
        ctx.accounts.yield_distribution_record.facility_id == facility_id,
        YieldVaultError::InvalidFacility
    );
    require!(
        ctx.accounts.yield_distribution_record.snapshot_id == snapshot_id,
        YieldVaultError::InvalidSnapshotId
    );
    require!(
        ctx.accounts.yield_position.facility_id == facility_id,
        YieldVaultError::InvalidYieldPosition
    );
    require!(
        ctx.accounts.yield_position.active,
        YieldVaultError::PositionInactive
    );
    require!(
        ctx.accounts.facility_yield_pool.pending_unallocated_lamports >= amount_lamports,
        YieldVaultError::OverAllocatePendingFunds
    );

    let pool = &mut ctx.accounts.facility_yield_pool;
    let position = &mut ctx.accounts.yield_position;
    let record = &mut ctx.accounts.yield_distribution_record;
    let now = Clock::get()?.unix_timestamp;

    position.claimable_lamports = position
        .claimable_lamports
        .checked_add(amount_lamports)
        .ok_or(YieldVaultError::MathOverflow)?;
    position.last_accrual_ts = now;

    pool.pending_unallocated_lamports = pool
        .pending_unallocated_lamports
        .checked_sub(amount_lamports)
        .ok_or(YieldVaultError::MathOverflow)?;
    pool.total_allocated_lamports = pool
        .total_allocated_lamports
        .checked_add(amount_lamports)
        .ok_or(YieldVaultError::MathOverflow)?;

    record.distributed_position_count = record
        .distributed_position_count
        .checked_add(1)
        .ok_or(YieldVaultError::MathOverflow)?;

    emit!(YieldAllocated {
        snapshot_id,
        facility_id,
        mint: position.mint,
        owner: position.owner,
        amount_lamports,
        timestamp: now,
    });

    Ok(())
}
