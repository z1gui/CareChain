# Priority Queue / Yield Vault 前端调用文档

本文档基于当前后端合约代码整理，面向前端开发，说明如何调用 `priority_queue` 和 `yield_vault` 两个 Program。

代码基准：

- [priority_queue lib.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/priority_queue/src/lib.rs)
- [yield_vault lib.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/yield_vault/src/lib.rs)
- [PriorityQueuePanel.tsx](/Users/leon/VsCodeProjects/CareChain/contract/carechain/app/src/components/PriorityQueuePanel.tsx)
- [YieldVaultPanel.tsx](/Users/leon/VsCodeProjects/CareChain/contract/carechain/app/src/components/YieldVaultPanel.tsx)

## 1. 合约信息

当前 Program ID：

- `carechain`: `2M14a3k2cbSVqAkViKMfVEqndLWESHwNTwCHRYD66PwY`
- `priority_queue`: `GB7xr669643BvgwmoDJwCEKFXWN252ECQtq3G2MhaENr`
- `yield_vault`: `AEDNejZqKMWRXPp8E2mtqmeBooNAr4rtkEN5mdAbv8Tp`

前端创建 Program：

```ts
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import priorityQueueIdl from "../../../target/idl/priority_queue.json";
import yieldVaultIdl from "../../../target/idl/yield_vault.json";

export const PRIORITY_QUEUE_PROGRAM_ID = new PublicKey(priorityQueueIdl.address);
export const YIELD_VAULT_PROGRAM_ID = new PublicKey(yieldVaultIdl.address);

export const getPriorityQueueProgram = (provider: AnchorProvider) =>
  new Program(priorityQueueIdl as Idl, provider);

export const getYieldVaultProgram = (provider: AnchorProvider) =>
  new Program(yieldVaultIdl as Idl, provider);
```

## 2. 通用接入

Provider：

```ts
import { AnchorProvider } from "@coral-xyz/anchor";

const provider = new AnchorProvider(connection, wallet as never, {
  commitment: "confirmed",
  preflightCommitment: "confirmed",
});
```

常用依赖：

```ts
import { AnchorProvider, BN, utils } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
```

约定：

- 所有 `u64` 金额前端统一传 `BN`
- `facility_id` 最大 32 字符
- `applicant_id` 最大 64 字符
- `snapshot_id` 最大 64 字符
- lamports 展示给用户时建议同步换算 SOL

## 3. PDA 规则

### 3.1 Priority Queue

```ts
const deriveQueueStatePda = (facilityId: string, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("queue_state"), utils.bytes.utf8.encode(facilityId)],
    programId
  )[0];

const deriveQueueEntryPda = (
  facilityId: string,
  applicantId: string,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("queue_entry"),
      utils.bytes.utf8.encode(facilityId),
      utils.bytes.utf8.encode(applicantId),
    ],
    programId
  )[0];

const deriveBedPositionPda = (mint: PublicKey, bedrightProgramId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("bed_position"), mint.toBuffer()],
    bedrightProgramId
  )[0];
```

### 3.2 Yield Vault

```ts
const deriveYieldVaultPda = (programId: PublicKey) =>
  PublicKey.findProgramAddressSync([utils.bytes.utf8.encode("yield_vault")], programId)[0];

const deriveFacilityYieldPoolPda = (facilityId: string, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("facility_yield_pool"), utils.bytes.utf8.encode(facilityId)],
    programId
  )[0];

const deriveYieldPositionPda = (mint: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("yield_position"), mint.toBuffer()],
    programId
  )[0];

const deriveYieldDistributionPda = (snapshotId: string, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("yield_distribution"), utils.bytes.utf8.encode(snapshotId)],
    programId
  )[0];
```

## 4. 枚举与状态值

### 4.1 QueueLane

- `P1 = 0`
- `P2 = 1`
- `P3 = 2`

### 4.2 QueueStatus

- `Waiting = 0`
- `Invited = 1`
- `Admitted = 2`
- `Cancelled = 3`

### 4.3 YieldSource

- `FacilityIncome = 0`
- `CareBurnBonus = 1`

Anchor 前端调用示例：

```ts
{ facilityIncome: {} }
{ careBurnBonus: {} }
```

## 5. Priority Queue 接口

当前后端暴露：

- `initializeQueue`
- `joinP3Queue`
- `registerP1FromNft`
- `burnCareAndUpgrade`
- `allocateNextBed`
- `confirmAdmission`
- `cancelQueueEntry`

### 5.1 initializeQueue

用途：

- 初始化设施级 `queue_state`

方法签名：

```ts
program.methods.initializeQueue(facilityId, new BN(burnPricePerDay))
```

账户：

- `admin`: 当前管理员钱包，签名
- `facility`: CareChain 的 Facility PDA 或设施地址
- `queueState`: `queue_state` PDA
- `systemProgram`

示例：

```ts
const queueStatePda = deriveQueueStatePda(facilityId, priorityQueueProgram.programId);

await priorityQueueProgram.methods
  .initializeQueue(facilityId, new BN(10))
  .accounts({
    admin: wallet.publicKey!,
    facility: facilityPda,
    queueState: queueStatePda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上效果：

- `p1_count = 0`
- `p2_count = 0`
- `p3_count = 0`
- `next_queue_no = 1`
- `multiplier_bps = 10000`
- `burn_price_per_day = 传入值`

注意：

- 合约只校验 `facility_id` 非空且长度不超过 32
- `facility` 账户在当前版本不会做更深校验，只是把公钥写入 `queue_state.facility`

### 5.2 joinP3Queue

用途：

- 普通用户加入 P3 队列

方法签名：

```ts
program.methods.joinP3Queue(facilityId, applicantId)
```

账户：

- `applicant`: 当前申请人钱包，签名
- `queueState`
- `queueEntry`
- `systemProgram`

示例：

```ts
const queueStatePda = deriveQueueStatePda(facilityId, priorityQueueProgram.programId);
const queueEntryPda = deriveQueueEntryPda(
  facilityId,
  applicantId,
  priorityQueueProgram.programId
);

await priorityQueueProgram.methods
  .joinP3Queue(facilityId, applicantId)
  .accounts({
    applicant: wallet.publicKey!,
    queueState: queueStatePda,
    queueEntry: queueEntryPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上效果：

- 新建 `queue_entry`
- `lane = P3`
- `status = Waiting`
- `queue_no = queue_state.next_queue_no`
- `wallet = 当前调用钱包`
- `mint = null`
- `burn_amount = 0`
- `p3_count + 1`
- 自动刷新价格

定价规则：

- `p3_count < 10` 时：`multiplier_bps = 10000`，`burn_price_per_day = 10`
- `10 <= p3_count <= 50` 时：`multiplier_bps = 15000`，`burn_price_per_day = 15`
- `p3_count > 50` 时：`multiplier_bps = 20000`，`burn_price_per_day = 20`

### 5.3 registerP1FromNft

用途：

- 持有 BedRight NFT 的用户登记为 P1

方法签名：

```ts
program.methods.registerP1FromNft(facilityId, applicantId)
```

账户：

- `applicant`: NFT 当前 owner，签名
- `queueState`
- `bedrightProgram`: BedRight Program ID，当前一般传 `CARECHAIN_PROGRAM_ID`
- `mint`: BedRight NFT Mint
- `bedPosition`: `bed_position` PDA
- `queueEntry`: `queue_entry` PDA
- `systemProgram`

示例：

```ts
const queueStatePda = deriveQueueStatePda(facilityId, priorityQueueProgram.programId);
const queueEntryPda = deriveQueueEntryPda(
  facilityId,
  applicantId,
  priorityQueueProgram.programId
);
const bedPositionPda = deriveBedPositionPda(mint, CARECHAIN_PROGRAM_ID);

await priorityQueueProgram.methods
  .registerP1FromNft(facilityId, applicantId)
  .accounts({
    applicant: wallet.publicKey!,
    queueState: queueStatePda,
    bedrightProgram: CARECHAIN_PROGRAM_ID,
    mint,
    bedPosition: bedPositionPda,
    queueEntry: queueEntryPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上校验：

- `bed_position` 必须是 `[b"bed_position", mint]` 派生出来的 PDA
- `bed_position.owner` 必须等于 `bedrightProgram`
- 解析后的 `bed_position.owner` 必须等于 `applicant`
- `bed_position.mode` 必须是 `Occupancy`
- `bed_position.mint` 必须等于传入 `mint`
- `bed_position.facility` 必须等于 `queue_state.facility`
- `bed_position.facility_id` 必须等于传入 `facilityId`

链上效果：

- 如果 `queue_entry` 不存在：创建并写成 P1
- 如果 `queue_entry` 已存在且未 `Admitted`：会更新为 P1 Waiting
- 如果原来是 Waiting/P2 或 Waiting/P3，会先回收原队列计数，再计入 P1
- 如果原来是 Waiting/P3，还会刷新价格

注意：

- 当前 P1 注册不会重新分配 `queue_no`，新建时 `queue_no = 0`
- 这个接口适合做“用 NFT 走优先通道”，不是普通排队入口

### 5.4 burnCareAndUpgrade

用途：

- 把当前 P3 Waiting 用户升级到 P2，并燃烧 CARE 代币

方法签名：

```ts
program.methods.burnCareAndUpgrade(
  facilityId,
  applicantId,
  new BN(burnAmount)
)
```

账户：

- `applicant`: 当前申请人钱包，签名
- `queueState`
- `queueEntry`
- `careMint`: CARE Mint
- `userCareAta`: 用户 CARE ATA
- `tokenProgram`

示例：

```ts
await priorityQueueProgram.methods
  .burnCareAndUpgrade(facilityId, applicantId, new BN(burnAmount))
  .accounts({
    applicant: wallet.publicKey!,
    queueState: queueStatePda,
    queueEntry: queueEntryPda,
    careMint,
    userCareAta,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .rpc();
```

链上校验：

- `burn_amount > 0`
- `queue_entry.wallet == applicant`
- 当前条目必须是 `P3`
- 当前状态必须是 `Waiting`
- `userCareAta.owner == applicant`
- `userCareAta.mint == careMint`
- `userCareAta.amount >= burnAmount`

链上效果：

- 先燃烧 CARE
- `queue_entry.burn_amount += burn_amount`
- `lane: P3 -> P2`
- `p3_count - 1`
- `p2_count + 1`
- 自动刷新价格

注意：

- 当前版本只校验 `userCareAta` 与传入的 `careMint` 一致，不额外校验“这个 mint 是否就是平台唯一 CARE mint”

### 5.5 allocateNextBed

用途：

- 管理员把某个 Waiting 条目标记为 `Invited`

方法签名：

```ts
program.methods.allocateNextBed(facilityId, applicantId)
```

账户：

- `admin`: 必须等于 `queue_state.admin_wallet`
- `queueState`
- `queueEntry`

示例：

```ts
await priorityQueueProgram.methods
  .allocateNextBed(facilityId, applicantId)
  .accounts({
    admin: wallet.publicKey!,
    queueState: queueStatePda,
    queueEntry: queueEntryPda,
  })
  .rpc();
```

链上效果：

- 仅允许 `Waiting -> Invited`
- 对应 lane 的计数会减少
- 如果是 P3，会刷新价格

注意：

- 当前接口虽然叫 `allocateNextBed`，但实际上是“按 applicantId 指定分配”，不是链上自动挑下一个人

### 5.6 confirmAdmission

用途：

- 管理员确认入住，把条目标记为 `Admitted`

方法签名：

```ts
program.methods.confirmAdmission(facilityId, applicantId)
```

账户：

- `admin`
- `queueState`
- `queueEntry`
- `bedrightProgram`
- `bedPosition`

示例：

```ts
const bedPositionPda = deriveBedPositionPda(mint, CARECHAIN_PROGRAM_ID);

await priorityQueueProgram.methods
  .confirmAdmission(facilityId, applicantId)
  .accounts({
    admin: wallet.publicKey!,
    queueState: queueStatePda,
    queueEntry: queueEntryPda,
    bedrightProgram: CARECHAIN_PROGRAM_ID,
    bedPosition: bedPositionPda,
  })
  .rpc();
```

链上校验：

- `admin == queue_state.admin_wallet`
- `queue_entry.status == Invited`
- `bed_position.owner == bedrightProgram`
- 解析后的 `bed_position.active == true`
- `bed_position.facility == queue_state.facility`
- `bed_position.facility_id == facilityId`

链上效果：

- `queue_entry.bed_position = bedPosition`
- `queue_entry.status = Admitted`

注意：

- 当前接口不会根据 `queue_entry.mint` 再次交叉校验 `bed_position.mint`
- 也就是说前端最好自行保证“邀请对象”和“确认入住床位”是业务上匹配的

### 5.7 cancelQueueEntry

用途：

- 用户本人或管理员取消排队条目

方法签名：

```ts
program.methods.cancelQueueEntry(facilityId, applicantId)
```

账户：

- `signer`: 用户本人，或者管理员
- `queueState`
- `queueEntry`

示例：

```ts
await priorityQueueProgram.methods
  .cancelQueueEntry(facilityId, applicantId)
  .accounts({
    signer: wallet.publicKey!,
    queueState: queueStatePda,
    queueEntry: queueEntryPda,
  })
  .rpc();
```

链上校验：

- `signer == queue_state.admin_wallet` 或 `signer == queue_entry.wallet`

链上效果：

- 条目状态改为 `Cancelled`
- 如果取消前状态是 `Waiting`，会回收对应 lane 计数
- 如果取消前是 Waiting/P3，会刷新价格

注意：

- 当前接口不会关闭账户，只是改状态
- 即使之前不是 `Waiting`，也仍然会把状态写成 `Cancelled`

## 6. Yield Vault 接口

当前后端暴露：

- `initializeYieldVault`
- `initializeFacilityYieldPool`
- `initializeYieldPosition`
- `depositYield`
- `allocateYieldToPositions`
- `claimYield`

说明：

- `sync_yield_owner.rs` 文件目前为空，`lib.rs` 也没有暴露对应方法，前端暂时不要接这个接口

### 6.1 initializeYieldVault

用途：

- 初始化全局收益金库

方法签名：

```ts
program.methods.initializeYieldVault(bedrightProgramId)
```

账户：

- `authority`: 金库管理员，签名
- `yieldVault`: `yield_vault` PDA
- `systemProgram`

示例：

```ts
const yieldVaultPda = deriveYieldVaultPda(yieldVaultProgram.programId);

await yieldVaultProgram.methods
  .initializeYieldVault(CARECHAIN_PROGRAM_ID)
  .accounts({
    authority: wallet.publicKey!,
    yieldVault: yieldVaultPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上效果：

- `yield_vault.authority = authority`
- `yield_vault.bedright_program_id = bedrightProgramId`

### 6.2 initializeFacilityYieldPool

用途：

- 初始化某个设施的收益池

方法签名：

```ts
program.methods.initializeFacilityYieldPool(facilityId)
```

账户：

- `authority`: 必须等于 `yield_vault.authority`
- `yieldVault`
- `facility`: 设施地址
- `facilityYieldPool`
- `systemProgram`

示例：

```ts
const facilityYieldPoolPda = deriveFacilityYieldPoolPda(
  facilityId,
  yieldVaultProgram.programId
);

await yieldVaultProgram.methods
  .initializeFacilityYieldPool(facilityId)
  .accounts({
    authority: wallet.publicKey!,
    yieldVault: yieldVaultPda,
    facility: facilityPda,
    facilityYieldPool: facilityYieldPoolPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上效果：

- 初始化统计字段
- `admin_wallet = authority`
- `facility = facilityPda`

### 6.3 initializeYieldPosition

用途：

- 为某个 BedRight NFT 初始化收益仓位

方法签名：

```ts
program.methods.initializeYieldPosition(facilityId)
```

账户：

- `payer`
- `yieldVault`
- `facilityYieldPool`
- `mint`
- `bedPosition`
- `yieldPosition`
- `systemProgram`

示例：

```ts
const bedPositionPda = deriveBedPositionPda(mint, CARECHAIN_PROGRAM_ID);
const yieldPositionPda = deriveYieldPositionPda(mint, yieldVaultProgram.programId);

await yieldVaultProgram.methods
  .initializeYieldPosition(facilityId)
  .accounts({
    payer: wallet.publicKey!,
    yieldVault: yieldVaultPda,
    facilityYieldPool: facilityYieldPoolPda,
    mint,
    bedPosition: bedPositionPda,
    yieldPosition: yieldPositionPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上校验：

- `bed_position` 必须是 `[b"bed_position", mint]`
- `bed_position.owner` 必须等于 `yield_vault.bedright_program_id`
- `bed_position.mint == mint`
- `bed_position.facility_id == facilityId`
- `facility_yield_pool.facility_id == bed_position.facility_id`
- `facility_yield_pool.facility == bed_position.facility`

链上效果：

- `yield_position.owner = bed_position.owner`
- `yield_position.facility_id = bed_position.facility_id`
- `yield_position.bed_position = bedPosition`
- `claimable_lamports = 0`
- `claimed_lamports = 0`
- `active = bed_position.active`

注意：

- 当前接口不会校验 `bed_position.mode` 是否是 `Yield`
- 是否允许收益资格，当前主要依赖业务侧和后续分配逻辑控制

### 6.4 depositYield

用途：

- 向金库转入 SOL，并给某个设施创建一条收益快照记录

方法签名：

```ts
program.methods.depositYield(
  facilityId,
  new BN(amountLamports),
  { facilityIncome: {} },
  snapshotId
)
```

账户：

- `admin`
- `yieldVault`
- `authority`: 必须等于 `yield_vault.authority`
- `facilityYieldPool`
- `yieldDistributionRecord`
- `systemProgram`

示例：

```ts
const yieldDistributionPda = deriveYieldDistributionPda(
  snapshotId,
  yieldVaultProgram.programId
);

await yieldVaultProgram.methods
  .depositYield(facilityId, new BN(amountLamports), { facilityIncome: {} }, snapshotId)
  .accounts({
    admin: wallet.publicKey!,
    yieldVault: yieldVaultPda,
    authority: wallet.publicKey!,
    facilityYieldPool: facilityYieldPoolPda,
    yieldDistributionRecord: yieldDistributionPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

链上校验：

- `amount_lamports > 0`
- `facility_yield_pool.admin_wallet == admin`
- `yield_vault.authority == authority`
- `facility_yield_pool.facility_id == facilityId`

链上效果：

- 从 `admin` 向 `yield_vault` 转 lamports
- `pool.total_deposited_lamports += amount`
- `pool.pending_unallocated_lamports += amount`
- 新建 `yield_distribution_record`

注意：

- `admin` 和 `authority` 在当前前端示例里通常是同一个钱包，但链上字段是分开的
- `snapshot_id` 需要唯一，否则 PDA 冲突

### 6.5 allocateYieldToPositions

用途：

- 从某个 `snapshot_id` 对应的池子余额里，给指定 `yield_position` 分配收益

方法签名：

```ts
program.methods.allocateYieldToPositions(
  facilityId,
  snapshotId,
  new BN(amountLamports)
)
```

账户：

- `admin`
- `facilityYieldPool`
- `yieldDistributionRecord`
- `yieldPosition`

示例：

```ts
await yieldVaultProgram.methods
  .allocateYieldToPositions(facilityId, snapshotId, new BN(amountLamports))
  .accounts({
    admin: wallet.publicKey!,
    facilityYieldPool: facilityYieldPoolPda,
    yieldDistributionRecord: yieldDistributionPda,
    yieldPosition: yieldPositionPda,
  })
  .rpc();
```

链上校验：

- `amount_lamports > 0`
- `facility_yield_pool.admin_wallet == admin`
- `facility_yield_pool.facility_id == facilityId`
- `yield_distribution_record.facility_id == facilityId`
- `yield_distribution_record.snapshot_id == snapshotId`
- `yield_position.facility_id == facilityId`
- `yield_position.active == true`
- `pending_unallocated_lamports >= amount_lamports`

链上效果：

- `yield_position.claimable_lamports += amount`
- `pool.pending_unallocated_lamports -= amount`
- `pool.total_allocated_lamports += amount`
- `yield_distribution_record.distributed_position_count += 1`

注意：

- 当前一次调用只能分配给一个 `yield_position`
- 如果一批收益要分给多个 NFT，前端需要循环发多笔交易，或服务端聚合后多次调用
- 当前 `distributed_position_count` 是按调用次数累加，不去重

### 6.6 claimYield

用途：

- NFT 当前收益 owner 领取可领取收益

方法签名：

```ts
program.methods.claimYield(mint)
```

账户：

- `user`: 当前 owner，签名
- `yieldVault`
- `facilityYieldPool`
- `yieldPosition`

示例：

```ts
await yieldVaultProgram.methods
  .claimYield(mint)
  .accounts({
    user: wallet.publicKey!,
    yieldVault: yieldVaultPda,
    facilityYieldPool: facilityYieldPoolPda,
    yieldPosition: yieldPositionPda,
  })
  .rpc();
```

链上校验：

- `yield_position.mint == mint`
- `yield_position.owner == user`
- `yield_position.claimable_lamports > 0`
- `facility_yield_pool.facility_id == yield_position.facility_id`
- `yield_vault` 除租金保底后的可用 lamports 足够支付

链上效果：

- 从 `yield_vault` 直接转 lamports 给 `user`
- `yield_position.claimable_lamports = 0`
- `yield_position.claimed_lamports += claim_amount`
- `facility_yield_pool.total_claimed_lamports += claim_amount`

注意：

- 当前领取的是原生 SOL，不是 SPL Token

## 7. 前端推荐调用顺序

### 7.1 Priority Queue

普通排队：

1. `initializeQueue`
2. `joinP3Queue`
3. `burnCareAndUpgrade` 可选
4. `allocateNextBed`
5. `confirmAdmission`

NFT 优先排队：

1. `initializeQueue`
2. `registerP1FromNft`
3. `allocateNextBed`
4. `confirmAdmission`

### 7.2 Yield Vault

1. `initializeYieldVault`
2. `initializeFacilityYieldPool`
3. `initializeYieldPosition`
4. `depositYield`
5. `allocateYieldToPositions`
6. `claimYield`

## 8. 前端读取建议

### 8.1 QueueState

重点字段：

- `p1_count`
- `p2_count`
- `p3_count`
- `next_queue_no`
- `multiplier_bps`
- `burn_price_per_day`

### 8.2 QueueEntry

重点字段：

- `wallet`
- `mint`
- `lane`
- `queue_no`
- `burn_amount`
- `status`
- `bed_position`

### 8.3 FacilityYieldPool

重点字段：

- `total_deposited_lamports`
- `total_allocated_lamports`
- `total_claimed_lamports`
- `pending_unallocated_lamports`

### 8.4 YieldPosition

重点字段：

- `owner`
- `claimable_lamports`
- `claimed_lamports`
- `active`

## 9. 容易踩坑的点

- `registerP1FromNft` 需要 `bed_position.mode == Occupancy`，不是 `Yield`
- `initializeYieldPosition` 当前不检查 `mode`，这和上面的 P1 规则不是一回事
- `allocateNextBed` 不是自动出队，而是按 `applicantId` 精确指定
- `confirmAdmission` 不会再校验 `queue_entry.mint` 和传入床位是否一一对应，前端要自己保证业务一致
- `cancelQueueEntry` 只是改状态，不会关闭 PDA
- `depositYield` 的 `snapshotId` 必须唯一
- `claimYield` 发的是原生 SOL，钱包余额会直接变化

## 10. 参考文件

- [priority_queue initialize_queue.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/priority_queue/src/instructions/initialize_queue.rs)
- [priority_queue register_p1_from_nft.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/priority_queue/src/instructions/register_p1_from_nft.rs)
- [priority_queue confirm_admission.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/priority_queue/src/instructions/confirm_admission.rs)
- [yield_vault deposit_yield.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/yield_vault/src/instructions/deposit_yield.rs)
- [yield_vault allocate_yield_to_positions.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/yield_vault/src/instructions/allocate_yield_to_positions.rs)
- [yield_vault claim_yield.rs](/Users/leon/VsCodeProjects/CareChain/contract/carechain/programs/yield_vault/src/instructions/claim_yield.rs)
