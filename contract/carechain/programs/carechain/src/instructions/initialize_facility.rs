use anchor_lang::prelude::*;
use crate::state::Facility;

/// 初始化养老设施
#[derive(Accounts)]
#[instruction(facility_id: String)]
pub struct InitializeFacility<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = Facility::LEN,
        seeds = [b"facility", facility_id.as_bytes()],
        bump,
    )]
    pub facility: Account<'info, Facility>,

    /// CHECK: 金库 USDC 代币账户，由管理员指定
    pub treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeFacility>,
    facility_id: String,
    name: String,
    city: String,
    total_beds: u16,
) -> Result<()> {
    let facility = &mut ctx.accounts.facility;
    facility.authority = ctx.accounts.authority.key();
    facility.facility_id = facility_id;
    facility.name = name;
    facility.city = city;
    facility.total_beds = total_beds;
    facility.sold_nfts = 0;
    facility.occupancy_rate = 0;
    facility.treasury = ctx.accounts.treasury.key();
    facility.bump = ctx.bumps.facility;

    msg!("设施初始化完成: {}", facility.name);
    Ok(())
}
