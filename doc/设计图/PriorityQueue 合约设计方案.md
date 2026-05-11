# PriorityQueue 合约设计方案

## 1. 目标

本文用于定义 CareChain MVP 中 `7.4 Queue 模块` 与 `8.3 PriorityQueue Program` 对应的完整合约设计，覆盖：

- 链上账户结构
- PDA 规则
- 指令方法
- 权限校验
- 错误码
- 事件模型
- 状态流转
- 动态定价规则
- 与 BedRight / YieldVault 的边界

目标是让该模块直接支撑以下接口与能力：

- `POST /api/queue/apply`
- `GET /api/queue/status/:applicant_id`
- `GET /api/queue/pricing`
- `POST /api/queue/burn-upgrade`
- `POST /api/admin/allocate`
- `POST /api/admin/release-bed`
- `confirm_admission`

---

## 2. 模块定位

`PriorityQueue Program` 设计为独立程序，专门负责：

- P3 普通排队
- P1 NFT 持有者优先通道
- P2 燃烧 CARE 跳队
- 管理员分配床位邀请
- 入住确认

它不负责：

- 申请人姓名、电话、备注等链下字段
- 等待天数的复杂预测
- 页面展示用的排序聚合
- 自动遍历全体队列候选人进行链上排序

---

## 3. 设计路线选择

本方案采用 `计数器 + 条目标记型` 队列设计。

### 3.1 方案说明

链上只维护：

- 某设施的整体队列状态 `QueueState`
- 每个申请人的排队条目 `QueueEntry`

链上不维护复杂的全量排序索引。  
分配时由后端先根据规则挑出候选人，管理员把目标条目传入合约，合约只负责校验和状态更新。

### 3.2 选择理由

- 最适合 Solana 的账户模型
- 避免无界遍历和高成本排序
- 黑客松 MVP 更容易联调
- 规则透明，后续可扩展为更强的链上排序校验

### 3.3 不采用的方案

- 不采用全链上完整优先队列：实现复杂、维护成本高
- 不采用纯链下排序：可信度太弱，不像完整合约

---

## 4. 链上账户设计

### 4.1 QueueState

作用：记录某设施的队列全局状态。

```ts
type QueueState = {
  facility_id: string;
  facility: string;
  admin_wallet: string;
  p1_count: number;
  p2_count: number;
  p3_count: number;
  next_queue_no: number;
  multiplier_bps: number;
  burn_price_per_day: number;
  updated_at: number;
  bump: number;
};
```

字段说明：

- `facility_id`：设施业务 ID
- `facility`：BedRight Program 中的 `Facility PDA`
- `admin_wallet`：设施管理员
- `p1_count / p2_count / p3_count`：当前有效排队人数
- `next_queue_no`：给 P3 新用户分配编号
- `multiplier_bps`：当前倍率，`10000 = 1.0`
- `burn_price_per_day`：当前跳队价格

### 4.2 QueueEntry

作用：记录单个申请人的排队状态。

```ts
type QueueEntry = {
  applicant_id: string;
  facility_id: string;
  wallet: string | null;
  mint: string | null;
  lane: "P1" | "P2" | "P3";
  queue_no: number;
  burn_amount: bigint;
  status: "waiting" | "invited" | "admitted" | "cancelled";
  bed_position: string | null;
  created_at: number;
  updated_at: number;
  bump: number;
};
```

字段说明：

- `wallet`：链上身份钱包，可为空
- `mint`：P1 由 NFT 持有人登记时记录的 NFT mint
- `queue_no`：P3 普通排队号
- `burn_amount`：累计燃烧 CARE 数量
- `bed_position`：入住后绑定的床位持仓

---

## 5. PDA 设计

### 5.1 QueueState

```text
["queue_state", facility_id]
```

### 5.2 QueueEntry

```text
["queue_entry", facility_id, applicant_id]
```

### 5.3 关系约束

- 一个设施对应一个 `QueueState`
- 一个申请人在某设施下对应一个 `QueueEntry`
- 一个 `QueueEntry` 在任意时刻只属于一个 lane

---

## 6. 核心枚举

### 6.1 QueueLane

```rust
enum QueueLane {
    P1,
    P2,
    P3,
}
```

### 6.2 QueueStatus

```rust
enum QueueStatus {
    Waiting,
    Invited,
    Admitted,
    Cancelled,
}
```

---

## 7. 指令方法设计

### 7.1 initialize_queue

作用：初始化某设施的队列全局状态。

```ts
type InitializeQueueArgs = {
  facilityId: string;
  burnPricePerDay: bigint;
};
```

主要行为：

- 创建 `QueueState`
- 记录设施和管理员
- 初始化 `p1/p2/p3 = 0`
- 初始化 `next_queue_no = 1`
- 初始化 `multiplier_bps = 10000`
- 初始化 `updated_at`

### 7.2 join_p3_queue

作用：普通家庭进入 P3 队列。

```ts
type JoinP3Args = {
  facilityId: string;
  applicantId: string;
};
```

主要行为：

- 创建 `QueueEntry`
- `lane = P3`
- `status = Waiting`
- `queue_no = next_queue_no`
- `burn_amount = 0`
- `mint = null`
- `bed_position = null`
- `p3_count += 1`
- `next_queue_no += 1`
- 更新动态定价

### 7.3 register_p1_from_nft

作用：NFT 持有人登记到 P1 通道。

```ts
type RegisterP1Args = {
  facilityId: string;
  applicantId: string;
  mint: string;
};
```

主要行为：

- 校验 `mint` 对应的 `BedPosition` 存在
- 校验 `BedPosition.owner == signer`
- 校验 `BedPosition.mode == Occupancy`
- 校验该床位属于对应设施
- 创建或更新 `QueueEntry`
- `lane = P1`
- `status = Waiting`
- `mint = mint`
- `queue_no = 0`
- `p1_count += 1`

### 7.4 burn_care_and_upgrade

作用：P3 用户燃烧 CARE 升级到 P2。

```ts
type BurnUpgradeArgs = {
  applicantId: string;
  burnAmount: bigint;
};
```

主要行为：

- 校验 `QueueEntry` 存在
- 校验 `lane == P3`
- 校验 `status == Waiting`
- 校验 `wallet == signer`
- 从 `user_care_ata` 销毁 CARE
- `lane = P2`
- `burn_amount += burnAmount`
- `p3_count -= 1`
- `p2_count += 1`
- 更新动态定价

### 7.5 allocate_next_bed

作用：管理员为某个候选条目发出床位邀请。

```ts
type AllocateNextBedArgs = {
  facilityId: string;
  applicantId: string;
};
```

主要行为：

- 校验调用者为设施管理员
- 传入目标 `QueueEntry`
- 校验其属于对应设施
- 校验 `status == Waiting`
- 将 `status = Invited`
- 若当前条目属于 P1/P2/P3，对应计数减一
- 不在链上做全局排序，只处理后端 / admin 已经选中的候选条目
- 更新 `updated_at`

### 7.6 confirm_admission

作用：管理员确认入住成功。

```ts
type ConfirmAdmissionArgs = {
  applicantId: string;
  bedPosition: string;
};
```

主要行为：

- 校验 `QueueEntry.status == Invited`
- 校验 `bed_position` 属于对应设施
- `status = Admitted`
- 记录 `bed_position`
- 更新 `updated_at`

### 7.7 cancel_queue_entry

作用：用户或管理员取消排队。

```ts
type CancelQueueEntryArgs = {
  applicantId: string;
};
```

主要行为：

- 校验条目存在
- 校验调用者为申请人或管理员
- 若 `status == Waiting`，减少对应 lane 的计数
- `status = Cancelled`
- 更新动态定价

---

## 8. 权限设计

### 8.1 initialize_queue

- 仅设施管理员可调用

### 8.2 join_p3_queue

- 用户本人或后端代表用户构造交易

### 8.3 register_p1_from_nft

- 必须为 NFT 当前持有人

### 8.4 burn_care_and_upgrade

- 必须为该条目的 owner 钱包

### 8.5 allocate_next_bed

- 必须为设施管理员

### 8.6 confirm_admission

- 必须为设施管理员

### 8.7 cancel_queue_entry

- 必须为申请人本人或设施管理员

---

## 9. 状态流转设计

### 9.1 QueueEntry.status

- `Waiting`
- `Invited`
- `Admitted`
- `Cancelled`

### 9.2 状态流转

- `join_p3_queue` -> `Waiting`
- `register_p1_from_nft` -> `Waiting`
- `burn_care_and_upgrade`：只改变 `lane`
- `allocate_next_bed`：`Waiting -> Invited`
- `confirm_admission`：`Invited -> Admitted`
- `cancel_queue_entry`：`Waiting/Invited -> Cancelled`

### 9.3 lane 变更规则

- 普通申请默认是 `P3`
- 燃烧 CARE 后从 `P3 -> P2`
- NFT 持有人登记后进入 `P1`

---

## 10. 动态定价规则

MVP 建议链上只维护当前结果，不维护整张规则表。

### 10.1 规则

```rust
if p3_count < 10 {
    multiplier_bps = 10000;
    burn_price_per_day = 10;
} else if p3_count <= 50 {
    multiplier_bps = 15000;
    burn_price_per_day = 15;
} else {
    multiplier_bps = 20000;
    burn_price_per_day = 20;
}
```

### 10.2 更新时机

- `join_p3_queue`
- `burn_care_and_upgrade`
- `cancel_queue_entry`
- `allocate_next_bed` 若作用于 P3

说明：

- `GET /api/queue/pricing` 可返回给前端一份展示用规则说明
- 合约账户中只保留 `multiplier_bps` 与 `burn_price_per_day` 当前值
- 完整规则表、历史价格快照与展示文案由后端维护

### 10.3 内部函数建议

```rust
fn refresh_pricing(queue_state: &mut QueueState)
```

---

## 11. 计数规则

`p1_count / p2_count / p3_count` 只统计当前满足以下条件的有效排队人数：

- `status == Waiting`
- `lane` 对应当前通道

当条目变成以下状态时应从计数中移除：

- `Invited`
- `Admitted`
- `Cancelled`

---

## 12. 错误码建议

```rust
pub enum QueueError {
    QueueAlreadyInitialized,
    QueueNotInitialized,
    QueueEntryAlreadyExists,
    QueueEntryNotFound,

    InvalidFacility,
    InvalidApplicantId,
    InvalidQueueLane,
    InvalidQueueStatus,
    InvalidBedPosition,

    UnauthorizedAdmin,
    UnauthorizedApplicant,
    UnauthorizedNftOwner,

    ApplicantNotInP3,
    ApplicantNotWaiting,
    ApplicantNotInvited,
    ApplicantAlreadyAdmitted,

    InvalidCareMint,
    InsufficientCareBalance,
    BurnAmountMustBePositive,

    InvalidBedRightMode,
    InvalidBedRightOwner,
    InvalidBedRightFacility,

    PricingRuleError,
    MathOverflow,
}
```

---

## 13. 事件设计

### 13.1 QueueJoined

```rust
event QueueJoined {
  facility_id: String,
  applicant_id: String,
  wallet: Pubkey,
  lane: u8,
  queue_no: u64,
  timestamp: i64,
}
```

### 13.2 QueueUpgraded

```rust
event QueueUpgraded {
  facility_id: String,
  applicant_id: String,
  wallet: Pubkey,
  old_lane: u8,
  new_lane: u8,
  burn_amount: u64,
  timestamp: i64,
}
```

### 13.3 BedAllocated

```rust
event BedAllocated {
  facility_id: String,
  applicant_id: String,
  lane: u8,
  status: u8,
  timestamp: i64,
}
```

### 13.4 AdmissionConfirmed

```rust
event AdmissionConfirmed {
  facility_id: String,
  applicant_id: String,
  bed_position: Pubkey,
  timestamp: i64,
}
```

### 13.5 PricingUpdated

```rust
event PricingUpdated {
  facility_id: String,
  p3_count: u32,
  multiplier_bps: u16,
  burn_price_per_day: u64,
  timestamp: i64,
}
```

---

## 14. 与其他合约的关系

### 14.1 与 BedRight Program

依赖场景：

- `register_p1_from_nft` 需要读取 `BedPosition`
- `confirm_admission` 需要校验 `bed_position` 归属设施

MVP 建议：

- 不做自动 CPI 联动
- 由前端/后端显式触发 PriorityQueue 相关交易

### 14.2 与 YieldVault Program

无强依赖。

只在业务层面存在间接联系：

- CARE 燃烧结果可由后端同步为 `care_burn_bonus`

---

## 15. allocate_next_bed 设计取舍

### 15.1 推荐方案

管理员传入目标 `QueueEntry`，合约只验证该条目的合法性，不在链上遍历全体候选人。

也就是说，`allocate_next_bed` 不承担全链上 `P1 -> P2 -> P3` 全局排序职责；候选人选择由后端 / admin 完成，合约负责做最小必要校验和状态更新。

优点：

- 简单
- 适合 Solana
- 易于联调

缺点：

- 严格优先级排序依赖后端和管理员遵守

### 15.2 不推荐方案

让合约自行扫描并保证 `P1 -> P2 -> P3` 全排序。

缺点：

- 需要传入大量账户
- 不适合 MVP

---

## 16. MVP 实现顺序

建议按以下顺序落地：

1. `initialize_queue`
2. `join_p3_queue`
3. `burn_care_and_upgrade`
4. `register_p1_from_nft`
5. `allocate_next_bed`
6. `confirm_admission`
7. `cancel_queue_entry`

---

## 17. 测试重点

至少覆盖以下测试：

- 管理员可成功 `initialize_queue`
- 普通申请可成功 `join_p3_queue`
- 连续 P3 申请时 `queue_no` 正确递增
- P3 数量变化时价格规则正确刷新
- NFT 持有人可成功 `register_p1_from_nft`
- 非 NFT owner 无法登记 P1
- P3 用户可成功 `burn_care_and_upgrade`
- 非 P3 用户无法升级
- 管理员可成功 `allocate_next_bed`
- 非管理员无法分配
- `Invited` 条目可成功 `confirm_admission`
- 无效 `bed_position` 无法确认入住
- 取消条目会正确回收计数

当前说明：

- Rust 单测已覆盖多条核心队列逻辑，适合作为当前 MVP 的主要本地验证方式
- `contract/carechain/tests/carechain.ts` 仍是 Anchor 默认脚手架的占位文件，现阶段应保持跳过，避免误导为已实现的 JS 集成测试
- 若本地未安装 `ts-mocha` 等 JS 测试二进制，Queue 的 TypeScript 集成测试不能直接运行，这属于当前 MVP 的已知取舍

---

## 18. 结论

该方案采用“设施级状态 + 用户级条目 + 管理员驱动分配”的 PriorityQueue 设计，适合 CareChain MVP：

- 能跑通普通申请排队
- 能支持 NFT 持有者优先
- 能支持 CARE 跳队升级
- 能支持管理员分配和入住确认
- 能与现有 `BedRight` / `YieldVault` 平滑衔接

这是当前阶段最稳妥、最容易实现、也最利于黑客松联调的一版 PriorityQueue 合约设计。
