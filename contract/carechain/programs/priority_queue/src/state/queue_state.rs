use anchor_lang::prelude::*;

use super::MAX_FACILITY_ID_LEN;

#[account]
pub struct QueueState {
    pub facility_id: String,
    pub facility: Pubkey,
    pub admin_wallet: Pubkey,
    pub p1_count: u32,
    pub p2_count: u32,
    pub p3_count: u32,
    pub next_queue_no: u64,
    pub multiplier_bps: u16,
    pub burn_price_per_day: u64,
    pub updated_at: i64,
    pub bump: u8,
}

impl QueueState {
    pub const LEN: usize = 8 // discriminator
        + (4 + MAX_FACILITY_ID_LEN) // facility_id
        + 32 // facility
        + 32 // admin_wallet
        + 4 // p1_count
        + 4 // p2_count
        + 4 // p3_count
        + 8 // next_queue_no
        + 2 // multiplier_bps
        + 8 // burn_price_per_day
        + 8 // updated_at
        + 1; // bump
}
