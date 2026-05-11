# Priority Queue / Yield Vault 后端接口前端请求文档

本文档基于当前 `backend` 项目的 Controller、DTO 和 Service 整理，面向前端开发，说明 Priority Queue 和 Yield 相关的 HTTP 接口如何调用。

代码基准：

- [QueueController.java](/Users/leon/VsCodeProjects/CareChain/backend/src/main/java/com/carechain/backend/queue/controller/QueueController.java)
- [QueueService.java](/Users/leon/VsCodeProjects/CareChain/backend/src/main/java/com/carechain/backend/queue/service/QueueService.java)
- [PortfolioController.java](/Users/leon/VsCodeProjects/CareChain/backend/src/main/java/com/carechain/backend/portfolio/controller/PortfolioController.java)
- [ChainController.java](/Users/leon/VsCodeProjects/CareChain/backend/src/main/java/com/carechain/backend/chain/controller/ChainController.java)
- [ApiResponse.java](/Users/leon/VsCodeProjects/CareChain/backend/src/main/java/com/carechain/backend/common/api/ApiResponse.java)

## 1. 基础说明

接口 Base URL：

```ts
const BASE_URL = "/api/v1";
```

当前与排队、收益相关的后端 HTTP 接口分布：

- Queue 相关：`/api/v1/queue-*`、`/api/v1/queue/*`
- Yield 相关：`/api/v1/portfolio/yield`、`/api/v1/portfolio/yield-trend`
- 资产/NFT 相关：`/api/v1/portfolio/assets`、`/api/v1/portfolio/nfts`
- 链上历史：`/api/v1/chain/history`

## 2. 通用响应格式

所有接口统一返回：

```json
{
  "success": true,
  "message": "",
  "data": {},
  "error": null
}
```

失败示例：

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "facilityId: facilityId is required"
  }
}
```

## 3. 鉴权说明

当前代码里只有 `/api/v1/auth/me` 被鉴权拦截。

因此本文档里的 queue、yield、portfolio、chain 查询接口当前都不需要 Bearer Token。

## 4. Queue 接口

### 4.1 申请排队预览

- `POST /api/v1/queue-applications/preview`

请求体：

```json
{
  "facilityId": "FAC-001",
  "bedAssetId": "BED-001"
}
```

前端示例：

```ts
export async function previewQueueApplication(payload: {
  facilityId: string;
  bedAssetId: string;
}) {
  const res = await fetch("/api/v1/queue-applications/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

说明：

- `facilityId`、`bedAssetId` 必填
- 当前返回会根据合约规则推导：
  - 默认普通申请走 `P3 -> joinP3Queue`
  - 如果 `bedAssetId` 命中 `nft / bedright / occupancy / mint` 关键词，会推导为 `P1 -> registerP1FromNft`

主要返回字段：

- `currentTier`
- `projectedStatus`
- `currentRank`
- `estimatedWaitDays`
- `queueNoPreview`
- `suggestedInstruction`
- `pricingSnapshot`
- `eligibility`
- `nextActions`
- `contractHints`

### 4.2 创建排队申请

- `POST /api/v1/queue-applications`

请求体：

```json
{
  "facilityId": "FAC-001",
  "bedAssetId": "BED-001"
}
```

前端示例：

```ts
export async function createQueueApplication(payload: {
  facilityId: string;
  bedAssetId: string;
}) {
  const res = await fetch("/api/v1/queue-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

说明：

- 当前 `applicationId` 是后端临时生成
- 当前返回会附带推导出的链上执行计划

主要返回字段：

- `applicationId`
- `status`
- `lane`
- `queueNo`
- `estimatedRank`
- `estimatedWaitDays`
- `onchainPlan`
- `pricingSnapshot`

### 4.3 燃烧升级预览

- `POST /api/v1/queue-burn-orders/preview`

请求体：

```json
{
  "applicationId": "qa_123",
  "burnAmount": 100
}
```

前端示例：

```ts
export async function previewQueueBurn(payload: {
  applicationId: string;
  burnAmount: number;
}) {
  const res = await fetch("/api/v1/queue-burn-orders/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

说明：

- `applicationId` 必填
- `burnAmount >= 0`
- 预览逻辑按合约规则推导：
  - `burnAmount > 0` 视为可执行 `burnCareAndUpgrade`
  - `burnAmount = 0` 会返回 `eligible = false`

主要返回字段：

- `currentTier`
- `newTier`
- `currentRank`
- `newRank`
- `estimatedWaitDaysBefore`
- `estimatedWaitDaysAfter`
- `timeSavedDays`
- `eligible`
- `blockingReason`
- `suggestedInstruction`

### 4.4 创建燃烧订单

- `POST /api/v1/queue-burn-orders`

请求体：

```json
{
  "applicationId": "qa_123",
  "burnAmount": 100
}
```

前端示例：

```ts
export async function createQueueBurnOrder(payload: {
  applicationId: string;
  burnAmount: number;
}) {
  const res = await fetch("/api/v1/queue-burn-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

主要返回字段：

- `burnOrderId`
- `status`
- `instruction`
- `expectedLaneTransition`
- `requiresUserSignature`
- `tokenRequirements`

### 4.5 获取全局队列

- `GET /api/v1/queue/global`

前端示例：

```ts
export async function getGlobalQueue() {
  const res = await fetch("/api/v1/queue/global");
  return res.json();
}
```

说明：

- 当前返回包含按合约规则整理的全局摘要：
  - `laneSummary`
  - `currentPricing`
  - `pricingRules`
  - `allocationMode`
  - `admissionRequirement`

### 4.6 获取当前钱包队列状态

- `GET /api/v1/queue/status?walletAddress=<wallet>`

前端示例：

```ts
export async function getQueueStatus(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const res = await fetch(`/api/v1/queue/status?${params.toString()}`);
  return res.json();
}
```

说明：

- 当前通过 `ChainQueryService.getQueueState(walletAddress)` 查询
- 会根据钱包 NFT 快照推导 `P1 / P3` 候选状态
- 如果没有命中 queue/bedright 相关 NFT，会返回 `NO_QUEUE_ASSETS`

主要返回字段：

- `status`
- `queueAssetCount`
- `queueAssetIds`
- `currentLane`
- `estimatedRank`
- `estimatedWaitDays`
- `burnPricePerDay`
- `multiplierBps`
- `p1Eligible`
- `burnUpgradeAvailable`
- `suggestedInstruction`

## 5. Yield 相关接口

### 5.1 获取钱包收益汇总

- `GET /api/v1/portfolio/yield?walletAddress=<wallet>`

前端示例：

```ts
export async function getPortfolioYield(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const res = await fetch(`/api/v1/portfolio/yield?${params.toString()}`);
  return res.json();
}
```

说明：

- 当前会根据钱包 NFT 快照推导收益仓位数量
- 因为尚未接入 `yield_vault` program parser，`claimableLamports`、`claimedLamports` 仍然是推导占位值

主要返回字段：

- `totalYield`
- `currency`
- `observedAssetCount`
- `yieldBearingAssetCount`
- `claimableLamports`
- `claimedLamports`
- `claimState`
- `estimatedMonthlyYield`
- `estimatedAnnualYield`

### 5.2 获取收益趋势

- `GET /api/v1/portfolio/yield-trend?range=6m`

前端示例：

```ts
export async function getYieldTrend(range = "6m") {
  const params = new URLSearchParams({ range });
  const res = await fetch(`/api/v1/portfolio/yield-trend?${params.toString()}`);
  return res.json();
}
```

说明：

- 当前返回启发式收益曲线，并额外带 `claimableLamports`

### 5.3 获取钱包资产

- `GET /api/v1/portfolio/assets?walletAddress=<wallet>`

前端示例：

```ts
export async function getPortfolioAssets(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const res = await fetch(`/api/v1/portfolio/assets?${params.toString()}`);
  return res.json();
}
```

### 5.4 获取钱包 NFT 列表

- `GET /api/v1/portfolio/nfts?walletAddress=<wallet>`

前端示例：

```ts
export async function getPortfolioNfts(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const res = await fetch(`/api/v1/portfolio/nfts?${params.toString()}`);
  return res.json();
}
```

## 6. 补充接口

### 6.1 获取链上历史

- `GET /api/v1/chain/history?walletAddress=<wallet>&limit=20`

前端示例：

```ts
export async function getChainHistory(walletAddress: string, limit = 20) {
  const params = new URLSearchParams({
    walletAddress,
    limit: String(limit),
  });
  const res = await fetch(`/api/v1/chain/history?${params.toString()}`);
  return res.json();
}
```

## 7. 当前接口状态总结

更接近真实链上查询的接口：

- `GET /api/v1/queue/status`
- `GET /api/v1/portfolio/assets`
- `GET /api/v1/portfolio/yield`
- `GET /api/v1/portfolio/nfts`
- `GET /api/v1/chain/history`

当前仍是 mock/stub 的接口：

- `POST /api/v1/queue-applications/preview`
- `POST /api/v1/queue-applications`
- `POST /api/v1/queue-burn-orders/preview`
- `POST /api/v1/queue-burn-orders`
- `GET /api/v1/queue/global`
- `GET /api/v1/portfolio/yield-trend`

补充说明：

- 虽然以上接口仍是启发式/推导式结果，但现在已经按 `priority_queue` 和 `yield_vault` 的合约语义补充了层级、价格带、升级路径、收益仓位状态等字段
