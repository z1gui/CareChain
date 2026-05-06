use anchor_lang::prelude::*;

/// 床位类型账户
#[account]
pub struct BedClass {
    /// 所属设施地址
    pub facility: Pubkey,
    /// 设施 ID
    pub facility_id: String,
    /// 床位类型 ID
    pub bed_class_id: String,
    /// 房间类型 (如 "标准单人间")
    pub room_type: String,
    /// 护理等级 (如 "生活自理型")
    pub care_tier: String,
    /// USDC 价格 (含小数位, 如 500_000_000 = 500 USDC)
    pub price_usdc: u64,
    /// 年化收益率 (basis points, 如 650 = 6.5%)
    pub apy_bps: u16,
    /// 总供应量
    pub total_supply: u16,
    /// 已铸造数量
    pub minted_supply: u16,
    /// 特权等级 (如 "P1")
    pub privilege_level: String,
    /// PDA bump
    pub bump: u8,
}

impl BedClass {
    pub const MAX_ID_LEN: usize = 32;
    pub const MAX_TYPE_LEN: usize = 64;
    pub const MAX_TIER_LEN: usize = 32;
    pub const MAX_PRIVILEGE_LEN: usize = 16;

    pub const LEN: usize = 8 // discriminator
        + 32 // facility
        + (4 + Self::MAX_ID_LEN) // facility_id
        + (4 + Self::MAX_ID_LEN) // bed_class_id
        + (4 + Self::MAX_TYPE_LEN) // room_type
        + (4 + Self::MAX_TIER_LEN) // care_tier
        + 8  // price_usdc
        + 2  // apy_bps
        + 2  // total_supply
        + 2  // minted_supply
        + (4 + Self::MAX_PRIVILEGE_LEN) // privilege_level
        + 1; // bump
}
