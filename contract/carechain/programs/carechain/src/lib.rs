use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("CqPp16dBjmgK5QN4ftThjWeW1Kkx5oGuHzRmvLPGKnJ4");

#[program]
pub mod carechain {
    use super::*;

    /// 初始化养老设施
    pub fn initialize_facility(
        ctx: Context<InitializeFacility>,
        facility_id: String,
        name: String,
        city: String,
        total_beds: u16,
    ) -> Result<()> {
        initialize_facility::handler(ctx, facility_id, name, city, total_beds)
    }

    /// 创建床位类型
    pub fn create_bed_class(
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
        create_bed_class::handler(
            ctx, facility_id, bed_class_id, room_type, care_tier,
            price_usdc, apy_bps, total_supply, privilege_level,
        )
    }

    /// 铸造 BedRight NFT
    pub fn mint_bedright_nft(
        ctx: Context<MintBedrightNft>,
        facility_id: String,
        bed_class_id: String,
    ) -> Result<()> {
        mint_bedright_nft::handler(ctx, facility_id, bed_class_id)
    }
}
