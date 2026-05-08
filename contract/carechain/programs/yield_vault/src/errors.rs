use anchor_lang::prelude::*;

#[error_code]
pub enum YieldError {
    #[msg("Instruction is not implemented yet")]
    NotImplemented,
    #[msg("Vault already initialized")]
    VaultAlreadyInitialized,
    #[msg("Vault not initialized")]
    VaultNotInitialized,
    #[msg("Facility yield pool already initialized")]
    FacilityYieldPoolAlreadyInitialized,
    #[msg("Facility yield pool not found")]
    FacilityYieldPoolNotFound,
    #[msg("Yield position already initialized")]
    YieldPositionAlreadyInitialized,
    #[msg("Yield position not found")]
    YieldPositionNotFound,
    #[msg("Distribution record already exists")]
    DistributionRecordAlreadyExists,
    #[msg("Unauthorized admin")]
    UnauthorizedAdmin,
    #[msg("Unauthorized owner")]
    UnauthorizedOwner,
    #[msg("Invalid facility")]
    InvalidFacility,
    #[msg("Invalid bed position")]
    InvalidBedPosition,
    #[msg("Invalid yield position")]
    InvalidYieldPosition,
    #[msg("Invalid vault account")]
    InvalidVaultAccount,
    #[msg("Invalid snapshot id")]
    InvalidSnapshotId,
    #[msg("Amount must be positive")]
    AmountMustBePositive,
    #[msg("No claimable yield")]
    NoClaimableYield,
    #[msg("Insufficient vault balance")]
    InsufficientVaultBalance,
    #[msg("Over allocated pending funds")]
    OverAllocatePendingFunds,
    #[msg("Position inactive")]
    PositionInactive,
    #[msg("Position not in yield mode")]
    PositionNotInYieldMode,
    #[msg("Math overflow")]
    MathOverflow,
}

pub use YieldError as YieldVaultError;
