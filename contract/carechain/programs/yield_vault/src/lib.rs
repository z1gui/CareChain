use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::YieldSource;

declare_id!("AEDNejZqKMWRXPp8E2mtqmeBooNAr4rtkEN5mdAbv8Tp");

#[event]
pub struct YieldDeposited {
    pub snapshot_id: String,
    pub facility_id: String,
    pub admin: Pubkey,
    pub amount_lamports: u64,
    pub source: u8,
    pub timestamp: i64,
}

#[event]
pub struct YieldAllocated {
    pub snapshot_id: String,
    pub facility_id: String,
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount_lamports: u64,
    pub timestamp: i64,
}

#[event]
pub struct YieldClaimed {
    pub facility_id: String,
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount_lamports: u64,
    pub timestamp: i64,
}

#[event]
pub struct YieldOwnerSynced {
    pub mint: Pubkey,
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
    pub timestamp: i64,
}

#[program]
pub mod yield_vault {
    use super::*;

    /// 作用：初始化全局收益金库配置账户。
    /// 请求参数：`ctx` 为管理员和金库账户上下文，`bedright_program_id` 为关联的 BedRight 程序地址。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn initialize_yield_vault(
        ctx: Context<InitializeYieldVault>,
        bedright_program_id: Pubkey,
    ) -> Result<()> {
        initialize_yield_vault::handler(ctx, bedright_program_id)
    }

    /// 作用：初始化某个设施对应的收益池统计账户。
    /// 请求参数：`ctx` 为管理员、设施和收益池账户上下文，`facility_id` 为设施业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn initialize_facility_yield_pool(
        ctx: Context<InitializeFacilityYieldPool>,
        facility_id: String,
    ) -> Result<()> {
        initialize_facility_yield_pool::handler(ctx, facility_id)
    }

    /// 作用：为指定 NFT 初始化收益仓位账户。
    /// 请求参数：`ctx` 为付款人、设施、NFT 和床位账户上下文，`facility_id` 为设施业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn initialize_yield_position(
        ctx: Context<InitializeYieldPosition>,
        facility_id: String,
    ) -> Result<()> {
        initialize_yield_position::handler(ctx, facility_id)
    }

    /// 作用：向设施收益池注入原生 SOL 收益，并创建对应的分账批次记录。
    /// 请求参数：`ctx` 为管理员、收益池和批次账户上下文，`facility_id` 为设施业务 ID，`amount_lamports` 为注资金额，`source` 为收益来源，`snapshot_id` 为批次快照 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn deposit_yield(
        ctx: Context<DepositYield>,
        facility_id: String,
        amount_lamports: u64,
        source: YieldSource,
        snapshot_id: String,
    ) -> Result<()> {
        deposit_yield::handler(ctx, facility_id, amount_lamports, source, snapshot_id)
    }

    /// 作用：将某个收益批次中的一部分金额分配到指定 NFT 收益仓位。
    /// 请求参数：`ctx` 为管理员、收益池、批次和仓位账户上下文，`facility_id` 为设施业务 ID，`snapshot_id` 为批次快照 ID，`amount_lamports` 为本次分配金额。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn allocate_yield_to_positions(
        ctx: Context<AllocateYieldToPosition>,
        facility_id: String,
        snapshot_id: String,
        amount_lamports: u64,
    ) -> Result<()> {
        allocate_yield_to_positions::handler(ctx, facility_id, snapshot_id, amount_lamports)
    }

    /// 作用：由当前收益所有者领取指定 NFT 的可领取收益。
    /// 请求参数：`ctx` 为用户、收益池、收益仓位和金库账户上下文，`mint` 为目标 NFT 的 Mint 地址。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn claim_yield(ctx: Context<ClaimYield>, mint: Pubkey) -> Result<()> {
        claim_yield::handler(ctx, mint)
    }
}
