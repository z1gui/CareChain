# YieldContract 设计方案

## 1. 目标

本文用于补全 CareChain MVP 中 `7.3 Yield 模块` 对应的链上设计，定义 `YieldVault Program` 的：

- 链上账户结构
- PDA 规则
- 指令方法
- 权限校验
- 错误码
- 事件模型
- 收益分账规则
- 测试重点

目标是让该模块可以直接支撑以下接口：

- `GET /api/yield/my/:wallet`
- `POST /api/yield/deposit`
- `POST /api/yield/claim`

---

## 2. 设计边界

### 2.1 模块定位

`YieldContract` 设计为独立程序 `YieldVault Program`，专门负责收益金库和收益领取逻辑。

### 2.2 职责划分

`YieldVault Program` 负责：

- 管理全局收益金库
- 管理设施级收益池
- 管理每个 NFT 的收益仓位
- 接收管理员注入收益
- 将收益分配到 Yield 仓位
- 允许 NFT 持有人领取收益

`YieldVault Program` 不负责：

- 链上自动遍历全部 NFT 进行分账
- 聚合前端展示历史
- 入住队列与分配逻辑
- NFT 铸造与模式切换主逻辑

### 2.3 与现有模块边界

- `BedRight Program`：负责 `Facility`、`BedClass`、`BedPosition`、NFT 铸造和模式状态
- `YieldVault Program`：负责收益账本和收益流转
- 后端：负责链上链下聚合、收益分账计算、批量交易参数生成、历史快照存储

---

## 3. 设计路线选择

本方案采用 `MVP 累计余额型` 设计。

### 3.1 方案说明

每个 NFT 对应一个 `YieldPosition` 账户。管理员注资后，收益不会自动全局分发，而是由后端根据规则先计算各仓位应得金额，再通过链上分配指令累加到各自的 `claimable_lamports`。用户领取时，直接从可领取余额中扣减。

### 3.2 选择理由

- 与现有 API 文档中的 `YieldPosition` 结构完全贴合
- 实现成本低，适合黑客松 MVP
- 审计逻辑直观
- 可以避免链上遍历全部持仓的复杂度

### 3.3 不采用的方案

- 不采用全局指数型：扩展性高，但实现复杂度过高
- 不采用快照凭证型：审计清晰，但领取逻辑与账户关系更复杂

---

## 4. 链上账户设计

### 4.1 YieldVault

作用：全局收益配置与程序级金库入口。

```ts
type YieldVault = {
  authority: string;
  bedright_program_id: string;
  bump: number;
};
```

字段说明：

- `authority`：协议管理员
- `yield_vault` PDA 本身作为原生 SOL 收益金库
- `bedright_program_id`：关联的 BedRight Program

### 4.2 FacilityYieldPool

作用：某个设施的收益池和累计统计。

```ts
type FacilityYieldPool = {
  facility_id: string;
  facility: string;
  admin_wallet: string;
  total_deposited_lamports: bigint;
  total_allocated_lamports: bigint;
  total_claimed_lamports: bigint;
  pending_unallocated_lamports: bigint;
  last_deposit_ts: number;
  bump: number;
};
```

字段说明：

- `facility_id`：设施业务 ID
- `facility`：BedRight Program 中的 `Facility PDA`
- `admin_wallet`：设施管理员钱包
- `pending_unallocated_lamports`：已注资但尚未分账的 lamports 余额

### 4.3 YieldPosition

作用：每个 NFT 对应一个收益仓位。

```ts
type YieldPosition = {
  mint: string;
  owner: string;
  facility_id: string;
  bed_position: string;
  claimable_lamports: bigint;
  claimed_lamports: bigint;
  care_boost_bps: number;
  last_claim_ts: number;
  last_accrual_ts: number;
  active: boolean;
  bump: number;
};
```

字段说明：

- `mint`：NFT mint
- `owner`：当前可领取收益的钱包
- `bed_position`：关联的 `BedPosition PDA`
- `care_boost_bps`：后续扩展 CARE 加成，MVP 默认 `0`

### 4.4 YieldDistributionRecord

作用：记录一次收益注资或分账批次，用于审计和后端同步。

```ts
type YieldDistributionRecord = {
  snapshot_id: string;
  facility_id: string;
  source: "facility_income" | "care_burn_bonus";
  amount_lamports: bigint;
  distributed_position_count: number;
  created_by: string;
  created_at: number;
  bump: number;
};
```

---

## 5. PDA 设计

### 5.1 YieldVault

```text
["yield_vault"]
```

### 5.2 FacilityYieldPool

```text
["facility_yield_pool", facility_id]
```

### 5.3 YieldPosition

```text
["yield_position", mint]
```

### 5.4 YieldDistributionRecord

```text
["yield_distribution", snapshot_id]
```

### 5.5 关系约束

- 一个 `YieldVault` PDA 对应一个全局原生 SOL 金库
- 一个 `FacilityYieldPool` 归属于一个设施
- 一个 `YieldPosition` 严格对应一枚 NFT
- 一个 `snapshot_id` 对应一条收益批次记录

---

## 6. 指令方法设计

### 6.1 initialize_yield_vault

作用：初始化全局收益金库。

```ts
type InitializeYieldVaultArgs = {
  bedrightProgramId: string;
};
```

主要行为：

- 创建 `YieldVault`
- 写入管理员、BedRight Program ID，并使用该 PDA 持有原生 SOL

### 6.2 initialize_facility_yield_pool

作用：为设施初始化收益池。

```ts
type InitializeFacilityYieldPoolArgs = {
  facilityId: string;
};
```

主要行为：

- 校验设施存在
- 校验调用者是该设施管理员
- 创建 `FacilityYieldPool`

### 6.3 initialize_yield_position

作用：为某枚 NFT 初始化收益仓位。

```ts
type InitializeYieldPositionArgs = {
  facilityId: string;
  mint: string;
};
```

主要行为：

- 校验对应 `BedPosition` 存在
- 校验该 `mint` 尚未初始化
- 从链上状态确定 owner
- 创建 `YieldPosition`

### 6.4 deposit_yield

作用：管理员向设施收益池注入原生 SOL。

```ts
type DepositYieldArgs = {
  facilityId: string;
  amountLamports: bigint;
  source: "facility_income" | "care_burn_bonus";
  snapshotId: string;
};
```

主要行为：

- 从管理员钱包转账 lamports 到 `yield_vault` PDA
- 更新 `total_deposited_lamports`
- 更新 `pending_unallocated_lamports`
- 创建 `YieldDistributionRecord`

### 6.5 allocate_yield_to_positions

作用：按后端预计算结果批量分配收益。

```ts
type AllocateYieldArgs = {
  facilityId: string;
  snapshotId: string;
  allocations: {
    mint: string;
    amountLamports: bigint;
  }[];
};
```

主要行为：

- 校验批次存在
- 校验所有仓位属于同一设施
- 将收益增加到各个 `YieldPosition.claimable_lamports`
- 更新 `last_accrual_ts`
- 扣减 `pending_unallocated_lamports`
- 增加 `total_allocated_lamports`

### 6.6 claim_yield

作用：NFT 当前持有人领取收益。

```ts
type ClaimYieldArgs = {
  mint: string;
};
```

主要行为：

- 校验调用者为当前 owner
- 校验 `claimable_lamports > 0`
- 从程序金库向用户转出原生 SOL lamports
- 更新 `claimed_lamports`
- 将 `claimable_lamports` 归零
- 更新 `last_claim_ts`
- 增加设施池的 `total_claimed_lamports`

### 6.7 sync_yield_owner

作用：在 NFT 转移后同步收益领取人。

```ts
type SyncYieldOwnerArgs = {
  mint: string;
};
```

主要行为：

- 读取 NFT 当前持有状态
- 更新 `YieldPosition.owner`

---

## 7. 权限与校验规则

### 7.1 initialize_yield_vault

- 仅协议管理员可调用
- `yield_vault` PDA 作为唯一程序金库地址

### 7.2 initialize_facility_yield_pool

- 调用者必须等于 `Facility.authority`
- 对应 `Facility` 必须存在

### 7.3 initialize_yield_position

- 对应 `BedPosition` 必须存在
- 一个 `mint` 只能初始化一个 `YieldPosition`
- `owner` 必须从 NFT 或 `BedPosition` 推导，不允许外部直接传值

### 7.4 deposit_yield

- 必须是设施管理员
- `amount_lamports > 0`
- 转入目标必须是程序登记的 `yield_vault` PDA

### 7.5 allocate_yield_to_positions

- 必须由设施管理员或授权执行角色调用
- 每个 `YieldPosition` 必须归属该设施
- 每个仓位必须 `active = true`
- 推荐强校验对应 `BedPosition.mode == Yield`
- 分配总额不得超过 `pending_unallocated_lamports`

### 7.6 claim_yield

- 调用者必须等于 `YieldPosition.owner`
- `claimable_lamports > 0`
- 程序金库余额必须足够
- 程序金库必须保留 rent-exempt 最低余额

### 7.7 sync_yield_owner

- 可以允许任意人触发，也可以限制 owner 或后端 relayer
- 但新 owner 必须由链上 NFT 所有权推导，不能由调用者自定义

---

## 8. 收益分账规则

### 8.1 MVP 基本规则

- 仅 `BedPosition.mode == Yield` 的仓位参与收益分账
- `active = true` 的仓位才可参与
- 默认采用等权分配
- `care_boost_bps` 字段保留，但 MVP 不启用

### 8.2 分账公式

```ts
positionShare = floor(
  totalDistributableLamports * weight_i / totalWeight
)
```

MVP 默认：

```ts
weight_i = 1
```

未来扩展：

```ts
weight_i = baseWeight * (10000 + careBoostBps) / 10000
```

### 8.3 尾差处理

- 分账取整产生的尾差继续留在 `pending_unallocated_lamports`
- 在后续分账批次中继续使用

### 8.4 模式约束

- `Occupancy` 模式仓位不参与当期收益分配
- 若模式切换发生在分账前，以分账执行时的链上状态为准

---

## 9. 事件设计

### 9.1 YieldDeposited

```rust
event YieldDeposited {
  snapshot_id: String,
  facility_id: String,
  admin: Pubkey,
  amount_lamports: u64,
  source: u8,
  timestamp: i64,
}
```

### 9.2 YieldAllocated

```rust
event YieldAllocated {
  snapshot_id: String,
  facility_id: String,
  mint: Pubkey,
  owner: Pubkey,
  amount_lamports: u64,
  timestamp: i64,
}
```

### 9.3 YieldClaimed

```rust
event YieldClaimed {
  facility_id: String,
  mint: Pubkey,
  owner: Pubkey,
  amount_lamports: u64,
  timestamp: i64,
}
```

### 9.4 YieldOwnerSynced

```rust
event YieldOwnerSynced {
  mint: Pubkey,
  old_owner: Pubkey,
  new_owner: Pubkey,
  timestamp: i64,
}
```

---

## 10. 错误码建议

```rust
pub enum YieldError {
    VaultAlreadyInitialized,
    VaultNotInitialized,
    FacilityYieldPoolAlreadyInitialized,
    FacilityYieldPoolNotFound,
    YieldPositionAlreadyInitialized,
    YieldPositionNotFound,
    DistributionRecordAlreadyExists,

    UnauthorizedAdmin,
    UnauthorizedOwner,
    InvalidFacility,
    InvalidBedPosition,
    InvalidYieldPosition,
    InvalidVaultAccount,
    InvalidSnapshotId,

    AmountMustBePositive,
    NoClaimableYield,
    InsufficientVaultBalance,
    OverAllocatePendingFunds,
    PositionInactive,
    PositionNotInYieldMode,
    MathOverflow,
    ClaimFailed,
    DepositFailed,
}
```

与 API 文档中的错误码建议保持兼容：

- `VAULT_NOT_INITIALIZED`
- `NO_CLAIMABLE_YIELD`
- `CLAIM_FAILED`
- `INVALID_POSITION`

---

## 11. 与 API 的映射

### 11.1 GET /api/yield/my/:wallet

后端职责：

- 查询链上 `YieldPosition`
- 聚合 `total_claimable_lamports`
- 聚合 `total_claimed_lamports`
- `history` 来自链下 `yield_snapshots` 表或链上事件同步结果

### 11.2 POST /api/yield/deposit

建议后端内部拆分为两步：

1. `deposit_yield`
2. `allocate_yield_to_positions`

若前端需要单接口体验，可由后端在 API 层做统一封装。

### 11.3 POST /api/yield/claim

直接映射：

- `claim_yield`

---

## 12. 最小可运行闭环

MVP 跑通顺序建议如下：

1. `initialize_yield_vault`
2. `initialize_facility_yield_pool`
3. NFT 铸造后调用 `initialize_yield_position`
4. 管理员调用 `deposit_yield`
5. 管理员调用 `allocate_yield_to_positions`
6. 用户调用 `claim_yield`

---

## 13. 测试重点

至少覆盖以下测试场景：

- 管理员可成功 `deposit_yield`
- 非管理员调用 `deposit_yield` 失败
- `allocate_yield_to_positions` 后 `claimable_lamports` 正确增加
- 分配总额超过 `pending_unallocated_lamports` 会失败
- `Occupancy` 模式仓位不能被分账
- owner 成功 `claim_yield`
- 非 owner 领取失败
- 领取后 `claimable_lamports = 0`
- 多次领取不会重复支付
- NFT 转移后可通过 `sync_yield_owner` 更新 owner
- 尾差保留在 `pending_unallocated_lamports`

---

## 14. 后续实现建议

实现阶段建议按以下顺序推进：

1. 先实现基础账户与初始化指令
2. 再实现 `deposit_yield`
3. 再实现 `allocate_yield_to_positions`
4. 最后实现 `claim_yield` 和 `sync_yield_owner`

建议在 `BedRight Program` 中后续预留：

- 在 NFT 铸造成功后自动初始化 `YieldPosition` 的 CPI 扩展点
- 在模式切换时可联动收益资格校验

---

## 15. 结论

该方案采用独立的 `YieldVault Program`，使用“设施池 + NFT 仓位 + 批次记录”的结构，满足 CareChain MVP 对收益模块的最小需求：

- 支持管理员注资
- 支持按仓位分账
- 支持用户领取收益
- 支持后端聚合展示
- 可与现有 `BedRight NFT` 合约平滑对接

这是当前阶段最稳妥、最易实现、最利于联调的一版设计。
