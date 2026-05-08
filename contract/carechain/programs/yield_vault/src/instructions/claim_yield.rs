use anchor_lang::prelude::*;

use crate::{
    errors::YieldVaultError,
    state::{FacilityYieldPool, YieldPosition, YieldVault},
    YieldClaimed,
};

#[derive(Accounts)]
#[instruction(mint: Pubkey)]
pub struct ClaimYield<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"yield_vault"],
        bump = yield_vault.bump,
    )]
    pub yield_vault: Account<'info, YieldVault>,
    #[account(
        mut,
        constraint = facility_yield_pool.facility_id == yield_position.facility_id @ YieldVaultError::InvalidFacility,
    )]
    pub facility_yield_pool: Account<'info, FacilityYieldPool>,
    #[account(
        mut,
        seeds = [b"yield_position", mint.as_ref()],
        bump = yield_position.bump,
    )]
    pub yield_position: Account<'info, YieldPosition>,
}

/// 作用：将指定 NFT 的可领取收益从金库转给当前收益所有者。
/// 请求参数：`ctx` 为用户、收益池、收益仓位和金库账户上下文，`mint` 为目标 NFT 的 Mint 地址。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(ctx: Context<ClaimYield>, mint: Pubkey) -> Result<()> {
    require!(
        ctx.accounts.yield_position.mint == mint,
        YieldVaultError::InvalidYieldPosition
    );
    require!(
        ctx.accounts.yield_position.owner == ctx.accounts.user.key(),
        YieldVaultError::UnauthorizedOwner
    );
    require!(
        ctx.accounts.yield_position.claimable_lamports > 0,
        YieldVaultError::NoClaimableYield
    );

    let claim_amount = ctx.accounts.yield_position.claimable_lamports;
    let now = Clock::get()?.unix_timestamp;
    let vault_info = ctx.accounts.yield_vault.to_account_info();
    let user_info = ctx.accounts.user.to_account_info();
    let rent_reserve = Rent::get()?.minimum_balance(vault_info.data_len());
    let vault_balance = vault_info.lamports();
    let available_for_claim = vault_balance
        .checked_sub(rent_reserve)
        .ok_or(YieldVaultError::InsufficientVaultBalance)?;

    require!(
        available_for_claim >= claim_amount,
        YieldVaultError::InsufficientVaultBalance
    );

    let updated_vault_balance = vault_balance
        .checked_sub(claim_amount)
        .ok_or(YieldVaultError::InsufficientVaultBalance)?;
    let updated_user_balance = user_info
        .lamports()
        .checked_add(claim_amount)
        .ok_or(YieldVaultError::MathOverflow)?;

    **vault_info.try_borrow_mut_lamports()? = updated_vault_balance;
    **user_info.try_borrow_mut_lamports()? = updated_user_balance;

    let position = &mut ctx.accounts.yield_position;
    position.claimable_lamports = 0;
    position.claimed_lamports = position
        .claimed_lamports
        .checked_add(claim_amount)
        .ok_or(YieldVaultError::MathOverflow)?;
    position.last_claim_ts = now;

    let pool = &mut ctx.accounts.facility_yield_pool;
    pool.total_claimed_lamports = pool
        .total_claimed_lamports
        .checked_add(claim_amount)
        .ok_or(YieldVaultError::MathOverflow)?;

    emit!(YieldClaimed {
        facility_id: position.facility_id.clone(),
        mint: position.mint,
        owner: position.owner,
        amount_lamports: claim_amount,
        timestamp: now,
    });

    Ok(())
}
