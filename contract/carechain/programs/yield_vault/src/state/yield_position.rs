use anchor_lang::prelude::*;

use super::MAX_FACILITY_ID_LEN;

#[account]
pub struct YieldPosition {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub facility_id: String,
    pub bed_position: Pubkey,
    pub claimable_lamports: u64,
    pub claimed_lamports: u64,
    pub care_boost_bps: u16,
    pub last_claim_ts: i64,
    pub last_accrual_ts: i64,
    pub active: bool,
    pub bump: u8,
}

impl YieldPosition {
    pub const LEN: usize = 8 // discriminator
        + 32 // mint
        + 32 // owner
        + (4 + MAX_FACILITY_ID_LEN) // facility_id
        + 32 // bed_position
        + 8  // claimable_lamports
        + 8  // claimed_lamports
        + 2  // care_boost_bps
        + 8  // last_claim_ts
        + 8  // last_accrual_ts
        + 1  // active
        + 1; // bump
}
