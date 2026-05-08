use anchor_lang::prelude::*;

use crate::{
    errors::YieldVaultError,
    state::{
        parse_bed_position, FacilityYieldPool, YieldPosition, YieldVault, MAX_FACILITY_ID_LEN,
    },
};

#[derive(Accounts)]
#[instruction(facility_id: String)]
pub struct InitializeYieldPosition<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [b"yield_vault"],
        bump = yield_vault.bump,
    )]
    pub yield_vault: Account<'info, YieldVault>,
    #[account(
        seeds = [b"facility_yield_pool", facility_id.as_bytes()],
        bump = facility_yield_pool.bump,
    )]
    pub facility_yield_pool: Account<'info, FacilityYieldPool>,
    /// CHECK: The mint is matched against the BedRight bed position data.
    pub mint: UncheckedAccount<'info>,
    /// CHECK: Deserialized locally to avoid a hard dependency on the BedRight program crate.
    pub bed_position: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        space = YieldPosition::LEN,
        seeds = [b"yield_position", mint.key().as_ref()],
        bump,
    )]
    pub yield_position: Account<'info, YieldPosition>,
    pub system_program: Program<'info, System>,
}

/// 作用：基于 BedRight 床位状态为指定 NFT 初始化收益仓位。
/// 请求参数：`ctx` 为付款人、设施、NFT、床位和收益仓位账户上下文，`facility_id` 为设施业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(ctx: Context<InitializeYieldPosition>, facility_id: String) -> Result<()> {
    require!(
        !facility_id.is_empty() && facility_id.len() <= MAX_FACILITY_ID_LEN,
        YieldVaultError::InvalidFacility
    );
    let (expected_bed_position, _) = Pubkey::find_program_address(
        &[b"bed_position", ctx.accounts.mint.key().as_ref()],
        &ctx.accounts.yield_vault.bedright_program_id,
    );

    require!(
        ctx.accounts.bed_position.key() == expected_bed_position,
        YieldVaultError::InvalidBedPosition
    );
    require!(
        ctx.accounts.bed_position.owner == &ctx.accounts.yield_vault.bedright_program_id,
        YieldVaultError::InvalidBedPosition
    );

    let bed_position = parse_bed_position(&ctx.accounts.bed_position)?;

    require!(
        bed_position.mint == ctx.accounts.mint.key(),
        YieldVaultError::InvalidBedPosition
    );
    require!(
        bed_position.facility_id == facility_id,
        YieldVaultError::InvalidFacility
    );
    require!(
        ctx.accounts.facility_yield_pool.facility_id == bed_position.facility_id,
        YieldVaultError::InvalidFacility
    );
    require!(
        ctx.accounts.facility_yield_pool.facility == bed_position.facility,
        YieldVaultError::InvalidBedPosition
    );

    let yield_position = &mut ctx.accounts.yield_position;

    yield_position.mint = bed_position.mint;
    yield_position.owner = bed_position.owner;
    yield_position.facility_id = bed_position.facility_id;
    yield_position.bed_position = ctx.accounts.bed_position.key();
    yield_position.claimable_lamports = 0;
    yield_position.claimed_lamports = 0;
    yield_position.care_boost_bps = 0;
    yield_position.last_claim_ts = 0;
    yield_position.last_accrual_ts = 0;
    yield_position.active = bed_position.active;
    yield_position.bump = ctx.bumps.yield_position;

    Ok(())
}
