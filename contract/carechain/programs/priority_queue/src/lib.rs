use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("GB7xr669643BvgwmoDJwCEKFXWN252ECQtq3G2MhaENr");

#[event]
pub struct QueueJoined {
    pub facility_id: String,
    pub applicant_id: String,
    pub wallet: Pubkey,
    pub lane: u8,
    pub queue_no: u64,
    pub timestamp: i64,
}

#[event]
pub struct QueueUpgraded {
    pub facility_id: String,
    pub applicant_id: String,
    pub wallet: Pubkey,
    pub old_lane: u8,
    pub new_lane: u8,
    pub burn_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct BedAllocated {
    pub facility_id: String,
    pub applicant_id: String,
    pub lane: u8,
    pub status: u8,
    pub timestamp: i64,
}

#[event]
pub struct AdmissionConfirmed {
    pub facility_id: String,
    pub applicant_id: String,
    pub bed_position: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PricingUpdated {
    pub facility_id: String,
    pub p3_count: u32,
    pub multiplier_bps: u16,
    pub burn_price_per_day: u64,
    pub timestamp: i64,
}

#[program]
pub mod priority_queue {
    use super::*;

    /// 作用：初始化某个设施的排队总状态账户。
    /// 请求参数：`ctx` 为初始化所需账户上下文，`facility_id` 为设施业务 ID，`burn_price_per_day` 为初始每日燃烧价格。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn initialize_queue(
        ctx: Context<InitializeQueue>,
        facility_id: String,
        burn_price_per_day: u64,
    ) -> Result<()> {
        initialize_queue::handler(ctx, facility_id, burn_price_per_day)
    }

    /// 作用：为普通申请人创建 P3 排队条目，并刷新当前排队定价。
    /// 请求参数：`ctx` 为申请人和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn join_p3_queue(
        ctx: Context<JoinP3Queue>,
        facility_id: String,
        applicant_id: String,
    ) -> Result<()> {
        join_p3_queue::handler(ctx, facility_id, applicant_id)
    }

    /// 作用：基于 BedRight NFT 为用户登记 P1 通道排队资格。
    /// 请求参数：`ctx` 为 NFT、床位和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn register_p1_from_nft(
        ctx: Context<RegisterP1FromNft>,
        facility_id: String,
        applicant_id: String,
    ) -> Result<()> {
        register_p1_from_nft::handler(ctx, facility_id, applicant_id)
    }

    /// 作用：燃烧 CARE 代币，将等待中的 P3 申请人升级到 P2 通道。
    /// 请求参数：`ctx` 为申请人、CARE 代币和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID，`burn_amount` 为燃烧数量。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn burn_care_and_upgrade(
        ctx: Context<BurnCareAndUpgrade>,
        facility_id: String,
        applicant_id: String,
        burn_amount: u64,
    ) -> Result<()> {
        burn_care_and_upgrade::handler(ctx, facility_id, applicant_id, burn_amount)
    }

    /// 作用：由管理员将指定排队条目标记为已分配床位邀请。
    /// 请求参数：`ctx` 为管理员和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn allocate_next_bed(
        ctx: Context<AllocateNextBed>,
        facility_id: String,
        applicant_id: String,
    ) -> Result<()> {
        allocate_next_bed::handler(ctx, facility_id, applicant_id)
    }

    /// 作用：由管理员确认入住，并将排队条目更新为已入住状态。
    /// 请求参数：`ctx` 为管理员、床位和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn confirm_admission(
        ctx: Context<ConfirmAdmission>,
        facility_id: String,
        applicant_id: String,
    ) -> Result<()> {
        confirm_admission::handler(ctx, facility_id, applicant_id)
    }

    /// 作用：取消指定的排队条目，并在必要时回收计数和刷新定价。
    /// 请求参数：`ctx` 为调用者和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为目标申请人业务 ID。
    /// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
    pub fn cancel_queue_entry(
        ctx: Context<CancelQueueEntry>,
        facility_id: String,
        applicant_id: String,
    ) -> Result<()> {
        cancel_queue_entry::handler(ctx, facility_id, applicant_id)
    }
}
