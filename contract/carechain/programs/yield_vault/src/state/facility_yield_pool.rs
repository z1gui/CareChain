use anchor_lang::prelude::*;

use super::MAX_FACILITY_ID_LEN;

#[account]
pub struct FacilityYieldPool {
    pub facility_id: String,
    pub facility: Pubkey,
    pub admin_wallet: Pubkey,
    pub total_deposited_lamports: u64,
    pub total_allocated_lamports: u64,
    pub total_claimed_lamports: u64,
    pub pending_unallocated_lamports: u64,
    pub last_deposit_ts: i64,
    pub bump: u8,
}

impl FacilityYieldPool {
    pub const LEN: usize = 8 // discriminator
        + (4 + MAX_FACILITY_ID_LEN) // facility_id
        + 32 // facility
        + 32 // admin_wallet
        + 8  // total_deposited_lamports
        + 8  // total_allocated_lamports
        + 8  // total_claimed_lamports
        + 8  // pending_unallocated_lamports
        + 8  // last_deposit_ts
        + 1; // bump
}
