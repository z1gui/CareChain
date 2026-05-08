use anchor_lang::prelude::*;

use super::MAX_FACILITY_ID_LEN;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum YieldSource {
    FacilityIncome,
    CareBurnBonus,
}

#[account]
pub struct YieldDistributionRecord {
    pub snapshot_id: String,
    pub facility_id: String,
    pub source: YieldSource,
    pub amount_lamports: u64,
    pub distributed_position_count: u16,
    pub created_by: Pubkey,
    pub created_at: i64,
    pub bump: u8,
}

impl YieldDistributionRecord {
    pub const MAX_SNAPSHOT_ID_LEN: usize = 64;
    pub const YIELD_SOURCE_LEN: usize = 1;

    pub const LEN: usize = 8 // discriminator
        + (4 + Self::MAX_SNAPSHOT_ID_LEN) // snapshot_id
        + (4 + MAX_FACILITY_ID_LEN) // facility_id
        + Self::YIELD_SOURCE_LEN // source enum discriminant
        + 8  // amount_lamports
        + 2  // distributed_position_count
        + 32 // created_by
        + 8  // created_at
        + 1; // bump
}
