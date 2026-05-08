use anchor_lang::prelude::*;

use crate::errors::YieldVaultError;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BedRightBedMode {
    Yield,
    Occupancy,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BedRightBedPosition {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub facility: Pubkey,
    pub bed_class: Pubkey,
    pub facility_id: String,
    pub bed_class_id: String,
    pub mode: BedRightBedMode,
    pub last_mode_switch_ts: i64,
    pub active: bool,
    pub bump: u8,
}

pub fn parse_bed_position(bed_position: &UncheckedAccount<'_>) -> Result<BedRightBedPosition> {
    let data = bed_position.try_borrow_data()?;
    require!(data.len() >= 8, YieldVaultError::InvalidBedPosition);

    let mut payload: &[u8] = &data[8..];
    BedRightBedPosition::deserialize(&mut payload).map_err(|_| YieldVaultError::InvalidBedPosition.into())
}
