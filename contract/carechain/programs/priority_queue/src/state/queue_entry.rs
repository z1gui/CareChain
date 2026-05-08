use anchor_lang::prelude::*;

use super::{MAX_APPLICANT_ID_LEN, MAX_FACILITY_ID_LEN};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum QueueLane {
    P1,
    P2,
    P3,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum QueueStatus {
    Waiting,
    Invited,
    Admitted,
    Cancelled,
}

#[account]
pub struct QueueEntry {
    pub applicant_id: String,
    pub facility_id: String,
    pub wallet: Option<Pubkey>,
    pub mint: Option<Pubkey>,
    pub lane: QueueLane,
    pub queue_no: u64,
    pub burn_amount: u64,
    pub status: QueueStatus,
    pub bed_position: Option<Pubkey>,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

impl QueueEntry {
    pub const PUBKEY_OPTION_LEN: usize = 1 + 32;

    pub const LEN: usize = 8 // discriminator
        + (4 + MAX_APPLICANT_ID_LEN) // applicant_id
        + (4 + MAX_FACILITY_ID_LEN) // facility_id
        + Self::PUBKEY_OPTION_LEN // wallet
        + Self::PUBKEY_OPTION_LEN // mint
        + 1 // lane
        + 8 // queue_no
        + 8 // burn_amount
        + 1 // status
        + Self::PUBKEY_OPTION_LEN // bed_position
        + 8 // created_at
        + 8 // updated_at
        + 1; // bump
}
