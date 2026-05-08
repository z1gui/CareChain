use anchor_lang::prelude::*;

#[error_code]
pub enum QueueError {
    #[msg("Instruction is not implemented yet")]
    NotImplemented,
    #[msg("Queue already initialized")]
    QueueAlreadyInitialized,
    #[msg("Queue not initialized")]
    QueueNotInitialized,
    #[msg("Queue entry already exists")]
    QueueEntryAlreadyExists,
    #[msg("Queue entry not found")]
    QueueEntryNotFound,
    #[msg("Invalid facility")]
    InvalidFacility,
    #[msg("Invalid applicant id")]
    InvalidApplicantId,
    #[msg("Invalid queue lane")]
    InvalidQueueLane,
    #[msg("Invalid queue status")]
    InvalidQueueStatus,
    #[msg("Invalid bed position")]
    InvalidBedPosition,
    #[msg("Unauthorized admin")]
    UnauthorizedAdmin,
    #[msg("Unauthorized applicant")]
    UnauthorizedApplicant,
    #[msg("Unauthorized NFT owner")]
    UnauthorizedNftOwner,
    #[msg("Applicant is not in P3")]
    ApplicantNotInP3,
    #[msg("Applicant is not waiting")]
    ApplicantNotWaiting,
    #[msg("Applicant is not invited")]
    ApplicantNotInvited,
    #[msg("Applicant already admitted")]
    ApplicantAlreadyAdmitted,
    #[msg("Invalid CARE mint")]
    InvalidCareMint,
    #[msg("Insufficient CARE balance")]
    InsufficientCareBalance,
    #[msg("Burn amount must be positive")]
    BurnAmountMustBePositive,
    #[msg("Invalid BedRight mode")]
    InvalidBedRightMode,
    #[msg("Invalid BedRight owner")]
    InvalidBedRightOwner,
    #[msg("Invalid BedRight facility")]
    InvalidBedRightFacility,
    #[msg("Pricing rule error")]
    PricingRuleError,
    #[msg("Math overflow")]
    MathOverflow,
}
