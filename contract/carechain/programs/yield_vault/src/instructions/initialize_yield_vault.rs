use anchor_lang::prelude::*;

use crate::state::YieldVault;

#[derive(Accounts)]
pub struct InitializeYieldVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = YieldVault::LEN,
        seeds = [b"yield_vault"],
        bump,
    )]
    pub yield_vault: Account<'info, YieldVault>,
    pub system_program: Program<'info, System>,
}

/// 作用：初始化全局收益金库配置，并记录 BedRight 程序地址。
/// 请求参数：`ctx` 为管理员和金库账户上下文，`bedright_program_id` 为关联的 BedRight 程序地址。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(ctx: Context<InitializeYieldVault>, bedright_program_id: Pubkey) -> Result<()> {
    let yield_vault = &mut ctx.accounts.yield_vault;

    yield_vault.authority = ctx.accounts.authority.key();
    yield_vault.bedright_program_id = bedright_program_id;
    yield_vault.bump = ctx.bumps.yield_vault;

    Ok(())
}
