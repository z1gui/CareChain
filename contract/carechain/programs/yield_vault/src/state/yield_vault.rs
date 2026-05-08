use anchor_lang::prelude::*;

#[account]
pub struct YieldVault {
    pub authority: Pubkey,
    pub bedright_program_id: Pubkey,
    pub bump: u8,
}

impl YieldVault {
    pub const LEN: usize = 8 // discriminator
        + 32 // authority
        + 32 // bedright_program_id
        + 1; // bump
}
