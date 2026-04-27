use anchor_lang::prelude::*;

/// 养老设施账户
#[account]
pub struct Facility {
    /// 管理员地址
    pub authority: Pubkey,
    /// 设施 ID
    pub facility_id: String,
    /// 设施名称
    pub name: String,
    /// 城市
    pub city: String,
    /// 总床位数
    pub total_beds: u16,
    /// 已售 NFT 数量
    pub sold_nfts: u16,
    /// 占用率 (basis points, 0-10000)
    pub occupancy_rate: u16,
    /// 金库 USDC 代币账户地址
    pub treasury: Pubkey,
    /// PDA bump
    pub bump: u8,
}

impl Facility {
    pub const MAX_FACILITY_ID_LEN: usize = 32;
    pub const MAX_NAME_LEN: usize = 64;
    pub const MAX_CITY_LEN: usize = 32;

    pub const LEN: usize = 8 // discriminator
        + 32 // authority
        + (4 + Self::MAX_FACILITY_ID_LEN) // facility_id
        + (4 + Self::MAX_NAME_LEN) // name
        + (4 + Self::MAX_CITY_LEN) // city
        + 2  // total_beds
        + 2  // sold_nfts
        + 2  // occupancy_rate
        + 32 // treasury
        + 1; // bump
}
