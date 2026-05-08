use anchor_lang::prelude::*;

use crate::errors::QueueError;

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

pub fn parse_bed_position_data(data: &[u8]) -> Result<BedRightBedPosition> {
    require!(data.len() >= 8, QueueError::InvalidBedPosition);

    let mut payload: &[u8] = &data[8..];
    BedRightBedPosition::deserialize(&mut payload).map_err(|_| QueueError::InvalidBedPosition.into())
}

pub fn parse_bed_position(bed_position: &UncheckedAccount<'_>) -> Result<BedRightBedPosition> {
    let data = bed_position.try_borrow_data()?;
    parse_bed_position_data(&data)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bed_position_fixture() -> BedRightBedPosition {
        BedRightBedPosition {
            owner: Pubkey::new_unique(),
            mint: Pubkey::new_unique(),
            facility: Pubkey::new_unique(),
            bed_class: Pubkey::new_unique(),
            facility_id: "facility-1".to_string(),
            bed_class_id: "class-1".to_string(),
            mode: BedRightBedMode::Occupancy,
            last_mode_switch_ts: 1_700_000_000,
            active: true,
            bump: 3,
        }
    }

    #[test]
    fn parse_bed_position_data_reads_anchor_discriminator_prefixed_data() {
        let expected = bed_position_fixture();
        let mut encoded = vec![0; 8];
        expected
            .serialize(&mut encoded)
            .expect("fixture should serialize");

        let parsed = parse_bed_position_data(&encoded).expect("parse should succeed");

        assert_eq!(parsed.owner, expected.owner);
        assert_eq!(parsed.mint, expected.mint);
        assert_eq!(parsed.facility, expected.facility);
        assert_eq!(parsed.facility_id, expected.facility_id);
        assert!(parsed.mode == expected.mode);
    }
}
