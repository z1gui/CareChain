use anchor_lang::prelude::*;

/// 床位模式: 收益模式 / 入住模式
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BedMode {
    /// 收益模式 — 持有者获得分润
    Yield,
    /// 入住模式 — 持有者可直接入住
    Occupancy,
}

/// 床位持仓账户 — 每个 NFT 对应一个
#[account]
pub struct BedPosition {
    /// 持有者地址
    pub owner: Pubkey,
    /// NFT mint 地址
    pub mint: Pubkey,
    /// 所属设施地址
    pub facility: Pubkey,
    /// 所属床位类型地址
    pub bed_class: Pubkey,
    /// 设施 ID
    pub facility_id: String,
    /// 床位类型 ID
    pub bed_class_id: String,
    /// 当前模式
    pub mode: BedMode,
    /// 上次模式切换时间戳
    pub last_mode_switch_ts: i64,
    /// 是否激活
    pub active: bool,
    /// PDA bump
    pub bump: u8,
}

impl BedPosition {
    pub const MAX_ID_LEN: usize = 32;

    pub const LEN: usize = 8 // discriminator
        + 32 // owner
        + 32 // mint
        + 32 // facility
        + 32 // bed_class
        + (4 + Self::MAX_ID_LEN) // facility_id
        + (4 + Self::MAX_ID_LEN) // bed_class_id
        + 1  // mode
        + 8  // last_mode_switch_ts
        + 1  // active
        + 1; // bump
}
