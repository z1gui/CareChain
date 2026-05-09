# CareChain 合约与前端调试测试文档

## 1. 测试环境准备

### 1.1 本地验证节点

```bash
# 终端 1：启动本地 validator
solana-test-validator

# 终端 2：监听链上日志（查看事件和错误）
solana logs

# 终端 3：部署合约
anchor build
anchor deploy
```

### 1.2 关键配置确认

| 配置项 | 值 | 检查方式 |
|--------|-----|---------|
| `carechain` Program ID | `2M14a3k2cbSVqAkViKMfVEqndLWESHwNTwCHRYD66PwY` | `anchor keys list` |
| `priority_queue` Program ID | `GB7xr669643BvgwmoDJwCEKFXWN252ECQtq3G2MhaENr` | `anchor keys list` |
| `yield_vault` Program ID | `AEDNejZqKMWRXPp8E2mtqmeBooNAr4rtkEN5mdAbv8Tp` | `anchor keys list` |
| 默认 Facility ID | `foshan-01` | `src/config/chain.ts` |
| 管理员钱包 | 部署合约的钱包地址 | `solana address` |

### 1.3 前端网络切换

前端连接本地 validator 时，RPC URL 应为 `http://localhost:8899`。

---

## 2. CareChain 主合约测试用例（前置依赖）

Yield Vault 和 Priority Queue 都依赖 CareChain 主合约创建的 `bed_position`。必须先完成以下步骤。

### TC-1: 初始化设施 `initializeFacility`

| 项目 | 内容 |
|------|------|
| **目的** | 创建一个养老设施 |
| **调用者** | 管理员钱包 |
| **参数** | `facilityId: "foshan-01"`, `name: "佛山康养中心"`, `city: "Foshan"`, `totalBeds: 100` |
| **预期结果** | 成功创建 `facility` PDA |

**验证方法**：
```bash
solana account <facility_pda>
# 或使用前端查询
```

### TC-2: 创建床位类型 `createBedClass`

| 项目 | 内容 |
|------|------|
| **目的** | 为设施创建一种床位类型 |
| **调用者** | 管理员钱包 |
| **参数** | `facilityId: "foshan-01"`, `bedClassId: "standard-01"`, `roomType: "Standard"`, `careTier: "Basic"`, `priceSol: 5000000000` (5 SOL), `apyBps: 720` (7.2%), `totalSupply: 50`, `privilegeLevel: "P1"` |
| **预期结果** | 成功创建床位类型 |

### TC-3: 铸造 BedRight NFT `mintBedrightNft`

| 项目 | 内容 |
|------|------|
| **目的** | 为用户铸造一个 BedRight NFT，同时创建 `bed_position` |
| **调用者** | 用户钱包（需支付） |
| **参数** | `facilityId: "foshan-01"`, `bedClassId: "standard-01"` |
| **预期结果** | 用户钱包收到 NFT，`bed_position` PDA 被创建 |

**关键验证 — bed_position 必须存在**：
```ts
const bedPositionPda = deriveBedPositionPda(mintAddress)
const bedPosition = await carechainProgram.account.bedPosition.fetch(bedPositionPda)
console.log({
  mint: bedPosition.mint.toBase58(),      // 应等于 NFT mint
  owner: bedPosition.owner.toBase58(),     // 应等于用户钱包
  facilityId: bedPosition.facilityId,      // 应等于 "foshan-01"
  facility: bedPosition.facility.toBase58(), // 应等于 facility PDA
  active: bedPosition.active,              // 应为 true
})
```

> **重要**：如果 `bed_position` 不存在，后续 `initializeYieldPosition` 和 `registerP1FromNft` 都会失败。

---

## 3. Priority Queue 测试用例

### TC-4: 初始化队列 `initializeQueue`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-1 已完成（facility 已创建） |
| **调用者** | 管理员钱包 |
| **参数** | `facilityId: "foshan-01"`, `burnPricePerDay: 1000000000` (1 SOL/天) |
| **预期结果** | 创建 `queue_state` PDA，`p1Count=0, p2Count=0, p3Count=0` |

**验证**：
```ts
const queueState = await priorityQueueProgram.account.queueState.fetch(queueStatePda)
console.log(queueState.facilityId)        // "foshan-01"
console.log(queueState.burnPricePerDay.toString())  // "1000000000"
```

### TC-5: 用户加入 P3 队列 `joinP3Queue`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-4 已完成 |
| **调用者** | 普通用户钱包 |
| **参数** | `facilityId: "foshan-01"`, `applicantId: <用户钱包地址>` |
| **预期结果** | 创建 `queue_entry`，`lane=P3`, `status=waiting`, `queueState.p3Count` +1 |

### TC-6: 持有 NFT 用户注册 P1 `registerP1FromNft`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-3 已完成（用户持有 NFT），TC-4 已完成 |
| **调用者** | 持有 NFT 的用户钱包 |
| **参数** | `facilityId: "foshan-01"`, `applicantId: <用户钱包地址>` |
| **关键账户** | `mint` (NFT 地址), `bedPosition` (PDA) |
| **预期结果** | 创建/更新 `queue_entry`，`lane=P1`, `queueState.p1Count` +1 |

### TC-7: 燃烧 CARE 升级 P2 `burnCareAndUpgrade`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-5 已完成（用户在 P3） |
| **调用者** | 用户钱包 |
| **参数** | `facilityId: "foshan-01"`, `applicantId: <用户钱包地址>`, `burnAmount: 5000000000` |
| **关键账户** | `careMint`, `userCareAta` |
| **预期结果** | `queue_entry.lane` 变为 P2，`burnAmount` 增加，`p3Count-1`, `p2Count+1` |

### TC-8: 管理员分配床位 `allocateNextBed`

| 项目 | 内容 |
|------|------|
| **前置条件** | 用户在 waiting 状态 |
| **调用者** | 管理员钱包（必须等于 `queueState.adminWallet`） |
| **参数** | `facilityId: "foshan-01"`, `applicantId: <用户钱包地址>` |
| **预期结果** | `queue_entry.status` 变为 `invited` |

### TC-9: 管理员确认入住 `confirmAdmission`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-8 已完成（status = invited） |
| **调用者** | 管理员钱包 |
| **参数** | `facilityId: "foshan-01"`, `applicantId: <用户钱包地址>` |
| **关键账户** | `bedPosition` (PDA，不是 mint！) |
| **预期结果** | `queue_entry.status` 变为 `admitted` |

---

## 4. Yield Vault 测试用例（6步核心流程）

### TC-10: 初始化全局收益金库 `initializeYieldVault`

| 项目 | 内容 |
|------|------|
| **调用者** | 管理员钱包（成为 `authority`） |
| **参数** | `bedrightProgramId: CARECHAIN_PROGRAM_ID` |
| **预期结果** | 创建 `yield_vault` PDA |

**验证**：
```ts
const vault = await yieldVaultProgram.account.yieldVault.fetch(yieldVaultPda)
console.log(vault.authority.toBase58())          // 应等于管理员钱包
console.log(vault.bedrightProgramId.toBase58())  // 应等于 carechain Program ID
```

### TC-11: 初始化设施收益池 `initializeFacilityYieldPool`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-10 已完成 |
| **调用者** | 管理员钱包（必须等于 `yield_vault.authority`） |
| **参数** | `facilityId: "foshan-01"` |
| **关键账户** | `facility` (CareChain facility PDA) |
| **预期结果** | 创建 `facility_yield_pool` PDA |

**验证**：
```ts
const pool = await yieldVaultProgram.account.facilityYieldPool.fetch(poolPda)
console.log(pool.facilityId)              // "foshan-01"
console.log(pool.adminWallet.toBase58())  // 应等于管理员钱包
console.log(pool.totalDepositedLamports.toString())     // "0"
console.log(pool.pendingUnallocatedLamports.toString()) // "0"
```

### TC-12: 初始化 NFT 收益仓位 `initializeYieldPosition`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-3 已完成（`bed_position` 存在），TC-11 已完成 |
| **调用者** | 任意钱包（支付账户创建费用） |
| **参数** | `facilityId: "foshan-01"` |
| **关键账户** | `mint` (NFT), `bedPosition` (PDA) |
| **预期结果** | 创建 `yield_position` PDA，`owner` 从 `bed_position.owner` 复制 |

**验证**：
```ts
const position = await yieldVaultProgram.account.yieldPosition.fetch(positionPda)
console.log(position.mint.toBase58())       // 应等于 NFT mint
console.log(position.owner.toBase58())      // 应等于 NFT 持有者钱包
console.log(position.facilityId)            // "foshan-01"
console.log(position.claimableLamports.toString())  // "0"
console.log(position.active)                // true
```

### TC-13: 管理员充值收益 `depositYield`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-11 已完成 |
| **调用者** | 管理员钱包（必须同时等于 `yield_vault.authority` 和 `facility_yield_pool.admin_wallet`） |
| **参数** | `facilityId: "foshan-01"`, `amountLamports: 2000000000` (2 SOL), `source: { facilityIncome: {} }`, `snapshotId: "snap-2026-01"` |
| **预期结果** | 管理员钱包转出 2 SOL 到 `yield_vault`，创建 `yield_distribution_record`，`facility_yield_pool.pending_unallocated_lamports` = 2 SOL |

**验证**：
```ts
const pool = await yieldVaultProgram.account.facilityYieldPool.fetch(poolPda)
console.log(pool.totalDepositedLamports.toString())     // "2000000000"
console.log(pool.pendingUnallocatedLamports.toString()) // "2000000000"

const record = await yieldVaultProgram.account.yieldDistributionRecord.fetch(distPda)
console.log(record.snapshotId)             // "snap-2026-01"
console.log(record.amountLamports.toString()) // "2000000000"
console.log(record.distributedPositionCount)  // 0
```

### TC-14: 分配收益到 NFT 仓位 `allocateYieldToPositions`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-12 和 TC-13 已完成，`yield_position.active = true` |
| **调用者** | 管理员钱包（必须等于 `facility_yield_pool.admin_wallet`） |
| **参数** | `facilityId: "foshan-01"`, `snapshotId: "snap-2026-01"`, `amountLamports: 1250000000` (1.25 SOL) |
| **关键账户** | `yieldPosition` (PDA) |
| **预期结果** | `yield_position.claimable_lamports` += 1.25 SOL，`facility_yield_pool.pending_unallocated_lamports` -= 1.25 SOL |

**验证**：
```ts
const position = await yieldVaultProgram.account.yieldPosition.fetch(positionPda)
console.log(position.claimableLamports.toString())  // "1250000000"

const pool = await yieldVaultProgram.account.facilityYieldPool.fetch(poolPda)
console.log(pool.pendingUnallocatedLamports.toString()) // "750000000" (2 - 1.25)
console.log(pool.totalAllocatedLamports.toString())     // "1250000000"

const record = await yieldVaultProgram.account.yieldDistributionRecord.fetch(distPda)
console.log(record.distributedPositionCount)  // 1
```

### TC-15: NFT 持有者领取收益 `claimYield`

| 项目 | 内容 |
|------|------|
| **前置条件** | TC-14 已完成，`claimable_lamports > 0` |
| **调用者** | NFT 当前持有者钱包（必须等于 `yield_position.owner`） |
| **参数** | `mint: <NFT_Mint_Address>` |
| **预期结果** | `yield_position.claimable_lamports` 清零，`claimed_lamports` 增加，用户钱包收到 SOL |

**验证**：
```ts
// 领取前记录用户余额
const beforeBalance = await connection.getBalance(userWallet)

// 执行 claimYield

// 领取后
const position = await yieldVaultProgram.account.yieldPosition.fetch(positionPda)
console.log(position.claimableLamports.toString())  // "0"
console.log(position.claimedLamports.toString())    // "1250000000"

const afterBalance = await connection.getBalance(userWallet)
console.log('Received:', afterBalance - beforeBalance, 'lamports')  // 应接近 1250000000
```

> **注意**：实际收到金额会略少于 `claimable_lamports`，因为包含交易手续费。

---

## 5. 前端集成测试用例

### TC-16: Dashboard 收益聚合显示

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 用户持有 2 个 NFT，都在 yield vault 中有仓位 | Dashboard 加载 |
| 2 | 检查 PortfolioHero 的 "Accrued Yield" | 显示两个 NFT 的 `claimableLamports` 总和（SOL 单位） |
| 3 | 管理员执行 `allocateYieldToPositions` 给其中一个 NFT | Accrued Yield 数值自动更新（10秒轮询） |

### TC-17: NftCard 链上数据覆盖

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | NftCard 的 `mintAddress = undefined` | 显示 mock 数据（APY: 7.2%, Mode: Yield Mode） |
| 2 | 给 NftCard 传入真实 `mintAddress` | 自动查询链上，APY 标签变为 "Claimable"，显示真实 SOL 金额 |
| 3 | `yieldPosition.active = false` | Mode 标签变为 "Inactive" |

### TC-18: AssetManagementDialog Claim 流程

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 打开 Manage Asset（无 mintAddress） | 显示 Accrued USDC: $4,821.50（mock），无 Claim 按钮 |
| 2 | 传入真实 `mintAddress`，`claimableLamports = 0` | 显示 Claimable SOL: 0.0000，无 Claim 按钮 |
| 3 | 管理员分配收益后，`claimableLamports > 0` | 显示真实 SOL 金额，出现 Claim 按钮 |
| 4 | 点击 Claim 按钮 | 调用 `claimYield`，成功后弹窗关闭，余额刷新 |
| 5 | 再次打开 Manage Asset | claimable 显示为 0，Claim 按钮消失 |

---

## 6. 错误码速查与排错

### Priority Queue 错误

| 错误信息 | 触发指令 | 原因 | 排查方法 |
|---------|---------|------|---------|
| `Account does not exist` | `initializeQueue` | `facility` PDA 未创建 | 先执行 `initializeFacility` |
| `InvalidBedPosition` | `registerP1FromNft` | `bed_position` 不存在或数据不匹配 | 检查 NFT 是否已铸造，owner 是否正确 |
| `UnauthorizedAdmin` | `allocateNextBed` | 调用者不是 `queueState.adminWallet` | 确认使用初始化队列时的钱包 |
| `InvalidQueueStatus` | `confirmAdmission` | `queueEntry.status` 不是 `invited` | 先执行 `allocateNextBed` |

### Yield Vault 错误

| 错误信息 | 触发指令 | 原因 | 排查方法 |
|---------|---------|------|---------|
| `InvalidBedPosition` | `initializeYieldPosition` | `bed_position` 不存在 | 先铸造 NFT（TC-3） |
| `InvalidBedPosition` | `initializeYieldPosition` | `bed_position.owner` 不是 carechain program | 检查 carechain Program ID 配置 |
| `UnauthorizedAdmin` | `depositYield` | 调用者不是 `yield_vault.authority` | 用初始化 vault 的钱包 |
| `UnauthorizedAdmin` | `depositYield` | 调用者不是 `facility_yield_pool.admin_wallet` | `initializeYieldVault` 和 `initializeFacilityYieldPool` 需用同一钱包 |
| `AmountMustBePositive` | `depositYield` / `allocateYieldToPositions` | amount = 0 | 确保金额 > 0 |
| `OverAllocatePendingFunds` | `allocateYieldToPositions` | 分配金额 > pending_unallocated | 检查 pool 余额 |
| `PositionInactive` | `allocateYieldToPositions` | `yield_position.active = false` | 检查 NFT 状态 |
| `NoClaimableYield` | `claimYield` | `claimable_lamports = 0` | 先执行 `allocateYieldToPositions` |
| `UnauthorizedOwner` | `claimYield` | 调用者不是 `yield_position.owner` | NFT 可能已转让，需先执行 `sync_yield_owner` |
| `InsufficientVaultBalance` | `claimYield` | 金库余额不足（考虑 rent reserve） | 确保 `yield_vault` 有足够 SOL |

---

## 7. 前端调试技巧

### 7.1 打印所有 PDA 地址

```ts
import {
  deriveYieldVaultPda,
  deriveFacilityYieldPoolPda,
  deriveYieldPositionPda,
  deriveYieldDistributionPda,
  deriveBedPositionPda,
} from '@/utils/pda'

function debugPdas(facilityId: string, mint: PublicKey, snapshotId: string) {
  console.table({
    yieldVault: deriveYieldVaultPda().toBase58(),
    facilityYieldPool: deriveFacilityYieldPoolPda(facilityId).toBase58(),
    yieldPosition: deriveYieldPositionPda(mint).toBase58(),
    yieldDistribution: deriveYieldDistributionPda(snapshotId).toBase58(),
    bedPosition: deriveBedPositionPda(mint).toBase58(),
  })
}
```

### 7.2 监听链上事件

```ts
// 在组件中监听 YieldDeposited 事件
useEffect(() => {
  if (!program) return
  const listener = program.addEventListener('YieldDeposited', (event) => {
    console.log('Yield deposited:', event)
  })
  return () => { program.removeEventListener(listener) }
}, [program])
```

### 7.3 快速检查账户是否存在

```ts
const accountInfo = await connection.getAccountInfo(pda)
if (accountInfo === null) {
  console.log('账户不存在，需要先初始化')
} else {
  console.log('账户存在，数据大小:', accountInfo.data.length)
}
```

### 7.4 强制刷新数据

```ts
const queryClient = useQueryClient()

// 手动刷新所有 yield 相关数据
queryClient.invalidateQueries({ queryKey: ['yieldPosition'] })
queryClient.invalidateQueries({ queryKey: ['facilityYieldPool'] })
queryClient.invalidateQueries({ queryKey: ['yieldVault'] })
```
