use anchor_lang::prelude::*;

#[error_code]
pub enum CareChainError {
    #[msg("床位类型已售罄")]
    BedClassSoldOut,
    #[msg("无效的金库账户")]
    InvalidTreasury,
}
