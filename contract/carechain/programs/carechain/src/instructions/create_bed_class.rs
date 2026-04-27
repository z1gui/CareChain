use anchor_lang::prelude::*;
use crate::state::{Facility, BedClass};

/// 创建床位类型
#[derive(Accounts)]
#[instruction(facility_id: String, bed_class_id: String)]
pub struct CreateBedClass<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"facility", facility_id.as_bytes()],
        bump = facility.bump,
        has_one = authority,
    )]
    pub facility: Account<'info, Facility>,

    #[account(
        init,
        payer = authority,
        space = BedClass::LEN,
        seeds = [b"bed_class", facility_id.as_bytes(), bed_class_id.as_bytes()],
        bump,
    )]
    pub bed_class: Account<'info, BedClass>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateBedClass>,
    facility_id: String,
    bed_class_id: String,
    room_type: String,
    care_tier: String,
    price_usdc: u64,
    apy_bps: u16,
    total_supply: u16,
    privilege_level: String,
) -> Result<()> {
    let bed_class = &mut ctx.accounts.bed_class;
    bed_class.facility = ctx.accounts.facility.key();
    bed_class.facility_id = facility_id;
    bed_class.bed_class_id = bed_class_id;
    bed_class.room_type = room_type;
    bed_class.care_tier = care_tier;
    bed_class.price_usdc = price_usdc;
    bed_class.apy_bps = apy_bps;
    bed_class.total_supply = total_supply;
    bed_class.minted_supply = 0;
    bed_class.privilege_level = privilege_level;
    bed_class.bump = ctx.bumps.bed_class;

    msg!("床位类型创建完成: {}", bed_class.room_type);
    Ok(())
}
