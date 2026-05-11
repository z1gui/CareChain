# CareChain Prototype-Driven Backend Design

## 1. 文档目标

本文件基于 `doc/stitch_carechian_en` 下的前端原型页面，反推一版可直接支持前端开发的后端设计方案，重点回答以下问题：

1. 页面需要哪些后端模块
2. 页面需要请求哪些接口
3. 后端需要维护哪些核心数据表
4. 哪些数据应来自链上，哪些数据应由后端聚合
5. 关键业务流程应如何拆解

本文件偏向工程落地，不替代合约设计，但要求后端接口可以稳定支撑前端页面联调。

---

## 2. 原型页面与后端模块映射

### 2.1 页面分组

根据原型，页面可归并为以下几组：

1. 首页与协议介绍
2. 钱包连接
3. 设施列表与设施详情
4. NFT 购买
5. Dashboard / Portfolio / Asset Management
6. Priority Queue / Admission / Burn Acceleration
7. Check-in Payment
8. Buy $CARE

### 2.2 后端模块划分

建议后端拆为以下模块：

1. `auth`：钱包登录、签名校验、会话
2. `home`：首页概览、公告、协议统计
3. `facility`：设施列表、详情、资产 SKU、队列概况
4. `portfolio`：用户资产总览、收益曲线、持仓明细
5. `nft-order`：NFT 购买预览、下单、状态跟踪
6. `holding`：NFT 持仓管理、模式切换、转让
7. `queue`：入住申请、排队状态、加速预览、加速提交
8. `payment`：入住支付预览、支付状态、收款流向
9. `token`：CARE 汇率、兑换聚合、展示数据
10. `chain-sync`：链上事件同步、状态回写、幂等处理
11. `admin`：设施维护、收益注入、床位释放、人工审核

---

## 3. 后端职责边界

### 3.1 前端负责

- 页面展示
- 钱包连接与签名
- 用户输入
- 交易确认
- 轮询订单状态或订阅实时状态

### 3.2 后端负责

- 聚合链上与链下数据
- 统一输出前端展示字段
- 生成交易预览与交易上下文
- 持久化业务状态与审计日志
- 队列、收益、支付等复杂规则计算
- 链上事件监听与状态同步

### 3.3 合约负责

- NFT 所有权
- CARE burn
- 收益分配
- 模式切换
- 入住支付的链上转账与确认

---

## 4. 设计原则

1. 所有链上动作都拆成三个阶段：`preview`、`submit`、`query status`
2. 前端展示金额、等待时间、队列名次、收益数据，不依赖前端自行推导
3. 链上状态与链下状态分离，链下表用于页面查询与业务编排
4. 所有链上回写都必须幂等，按 `tx_hash + event_index` 去重
5. Priority Queue 和订单状态建议支持 WebSocket 或 SSE
6. 钱包即身份，不引入传统用户名密码体系

---

## 5. 核心数据模型

### 5.1 用户与钱包

#### `users`

- `id`
- `wallet_address`
- `display_wallet`
- `terms_accepted_at`
- `status`
- `created_at`
- `updated_at`

#### `wallet_sessions`

- `id`
- `wallet_address`
- `nonce`
- `message`
- `expired_at`
- `verified_at`

### 5.2 设施与资产

#### `facilities`

- `id`
- `code`
- `name`
- `city`
- `region`
- `country`
- `address`
- `cover_image`
- `facility_type`
- `description`
- `overview`
- `total_beds`
- `occupied_beds`
- `occupancy_rate`
- `status`

#### `bed_assets`

- `id`
- `facility_id`
- `asset_code`
- `room_type`
- `care_tier`
- `title`
- `description`
- `price_usdc`
- `apy_bps`
- `total_supply`
- `minted_supply`
- `available_supply`
- `priority_privilege`
- `status`

#### `nft_products`

- `id`
- `facility_id`
- `bed_asset_id`
- `product_name`
- `price_usdc`
- `est_apy_bps`
- `recommended`
- `rarity_tag`
- `status`

### 5.3 持仓与收益

#### `nft_holdings`

- `id`
- `wallet_address`
- `facility_id`
- `bed_asset_id`
- `product_id`
- `onchain_mint`
- `token_id`
- `mode`
- `mode_changed_at`
- `cooling_until`
- `status`

#### `yield_positions`

- `id`
- `holding_id`
- `wallet_address`
- `claimable_usdc`
- `claimed_usdc`
- `accrued_usdc`
- `monthly_yield_usdc`
- `annual_apy_bps`
- `last_snapshot_at`

#### `yield_snapshots`

- `id`
- `wallet_address`
- `holding_id`
- `facility_id`
- `snapshot_date`
- `yield_usdc`
- `portfolio_value_usdc`

### 5.4 队列与入住

#### `queue_applications`

- `id`
- `wallet_address`
- `facility_id`
- `bed_asset_id`
- `application_type`
- `tier`
- `rank_no`
- `estimated_wait_days`
- `burn_total`
- `status`
- `expected_checkin_at`
- `created_at`

#### `queue_burn_orders`

- `id`
- `application_id`
- `wallet_address`
- `burn_amount`
- `burn_value_usdc`
- `estimated_gas_usdc`
- `rank_before`
- `rank_after`
- `tier_before`
- `tier_after`
- `time_saved_days`
- `tx_hash`
- `status`

#### `checkin_orders`

- `id`
- `application_id`
- `wallet_address`
- `facility_id`
- `bed_asset_id`
- `assigned_asset_code`
- `entrance_fee_usdc`
- `receiver_wallet`
- `tx_hash`
- `status`

### 5.5 订单与事件

#### `nft_orders`

- `id`
- `wallet_address`
- `product_id`
- `facility_id`
- `bed_asset_id`
- `quantity`
- `unit_price_usdc`
- `total_amount_usdc`
- `pay_token`
- `tx_hash`
- `status`

#### `activity_logs`

- `id`
- `type`
- `wallet_address`
- `facility_id`
- `ref_id`
- `content`
- `created_at`

#### `chain_events`

- `id`
- `chain`
- `tx_hash`
- `event_index`
- `event_type`
- `payload`
- `processed_at`

---

## 6. 链上字段与链下字段划分

### 建议优先放链上

- NFT ownership
- NFT mode
- CARE burn amount
- 收益结算结果
- 入住支付转账结果
- 床位分配结果

### 建议放链下

- 设施介绍、图片、推荐文案
- 搜索筛选字段
- 仪表盘聚合统计
- 收益曲线快照
- 队列展示副本
- 订单状态说明文案
- 活动历史流

---

## 7. 统一响应格式

### 成功

```json
{
  "success": true,
  "message": "",
  "data": {},
  "error": null
}
```

### 失败

```json
{
  "success": false,
  "message": "Burn preview failed",
  "data": null,
  "error": {
    "code": "BURN_PREVIEW_FAILED",
    "details": "Application is not in waiting status"
  }
}
```

---

## 8. 页面到接口清单

### 8.1 钱包连接

#### `POST /api/v1/auth/challenge`

用途：生成签名 challenge

请求：

```json
{
  "wallet_address": "5end...4jdx"
}
```

#### `POST /api/v1/auth/verify`

用途：校验签名，创建登录态

#### `GET /api/v1/me`

用途：获取当前用户信息、钱包地址、持仓摘要

---

### 8.2 首页

#### `GET /api/v1/home/summary`

返回内容建议包含：

- protocol metrics
- featured facilities
- latest announcements
- queue overview
- yield roadmap data

---

### 8.3 设施列表页

#### `GET /api/v1/facilities`

查询参数：

- `keyword`
- `region`
- `room_type`
- `sort`
- `page`
- `page_size`

返回内容建议包含：

- 设施卡片基础信息
- occupancy
- APY range
- sold / available
- queue snapshot
- 是否可直接购买 NFT

#### `GET /api/v1/facilities/filters`

返回可选筛选项：

- region list
- room type list
- sort options

---

### 8.4 设施详情页

#### `GET /api/v1/facilities/:id`

返回：

- 设施头图
- 介绍
- 投资指标
- occupancy
- queue wait snapshot

#### `GET /api/v1/facilities/:id/assets`

返回：

- 房型列表
- 价格
- APY
- 稀缺标签
- 当前可售状态

#### `GET /api/v1/facilities/:id/queue-status`

返回：

- P1/P2/P3 当前等待时长
- 各档位人数
- 实时刷新时间

---

### 8.5 NFT 购买

#### `GET /api/v1/nft-products?facility_id=:id`

返回该设施的 NFT SKU 列表

#### `POST /api/v1/nft-orders/quote`

用途：前端点击购买前，获取总价、预估收益、支付币种

请求：

```json
{
  "product_id": "prod_001",
  "quantity": 1,
  "pay_token": "USDC"
}
```

#### `POST /api/v1/nft-orders`

用途：创建订单，返回链上交易上下文或订单编号

#### `GET /api/v1/nft-orders/:id`

用途：查询订单状态

---

### 8.6 Portfolio / Dashboard

#### `GET /api/v1/portfolio/summary`

对应页面字段：

- total NFTs
- total value
- monthly yield
- accrued yield
- annual APY
- average occupancy
- scarcity status
- queue jump cost

#### `GET /api/v1/portfolio/yield-trend?range=6m`

返回图表数据：

- x 轴日期
- y 轴收益
- portfolio value

#### `GET /api/v1/nft-holdings`

返回当前钱包持仓列表

#### `GET /api/v1/nft-holdings/:id`

返回单个资产详情

---

### 8.7 NFT 资产管理

#### `POST /api/v1/nft-holdings/:id/mode-switch/preview`

用途：预览切换 `yield` / `residence` 的影响

返回：

- current mode
- target mode
- cooling period
- expected yield change
- queue privilege change

#### `POST /api/v1/nft-holdings/:id/mode-switch`

用途：提交模式切换

#### `POST /api/v1/nft-holdings/:id/transfer`

用途：发起转让

请求：

```json
{
  "recipient_wallet": "0xabc..."
}
```

---

### 8.8 Admission / Queue / Burn Acceleration

#### `POST /api/v1/queue-applications/preview`

用途：点击 Apply Now 前，预览当前队列位置和等待时间

#### `POST /api/v1/queue-applications`

用途：正式提交入住申请

#### `GET /api/v1/queue-applications/:id`

用途：查询我的申请状态

#### `POST /api/v1/queue-burn-orders/preview`

用途：根据 burn 数量实时预览升级效果

请求：

```json
{
  "application_id": "qa_001",
  "burn_amount": 2500
}
```

返回：

```json
{
  "current_tier": "P3",
  "current_rank": 142,
  "new_tier": "P2",
  "new_rank": 12,
  "estimated_wait_days_before": 540,
  "estimated_wait_days_after": 30,
  "time_saved_days": 510,
  "burn_amount": 2500,
  "burn_value_usdc": "1240.50",
  "estimated_gas_usdc": "2.40"
}
```

#### `POST /api/v1/queue-burn-orders`

用途：提交 burn 加速订单

#### `GET /api/v1/queue/global`

用途：查询全局队列展示页

返回：

- P1/P2/P3 top list
- 当前人数
- 我的名次
- 历史活动流

#### `GET /api/v1/queue/history`

用途：Recent Activity History

#### `GET /api/v1/queue/my-position`

用途：返回当前钱包在队列中的位置

---

### 8.9 Check-in Payment

#### `POST /api/v1/payments/check-in/preview`

用途：展示支付详情和最终床位信息

返回：

- assigned asset code
- facility name
- entrance fee
- total due
- receiver wallet
- pay token

#### `POST /api/v1/payments/check-in`

用途：创建入住支付订单

#### `GET /api/v1/payments/:id`

用途：查询支付状态

---

### 8.10 Buy $CARE

#### `GET /api/v1/token/quote`

查询参数：

- `from_token`
- `to_token`
- `amount`

返回：

- exchange rate
- receive amount
- slippage
- route source

#### `POST /api/v1/token/swap-orders`

用途：如果兑换流程走后端聚合路由，则创建兑换订单

说明：如果前端直接调用 DEX Aggregator SDK，则后端只需要报价接口或甚至不需要此模块。

---

## 9. 关键状态机

### 9.1 NFT 订单状态

`draft -> pending_signature -> submitted -> confirmed -> minted -> failed`

### 9.2 入住申请状态

`draft -> waiting -> invited -> ready_for_checkin -> admitted -> cancelled`

### 9.3 Burn 加速订单状态

`previewed -> pending_signature -> submitted -> confirmed -> applied -> failed`

### 9.4 Check-in 支付状态

`created -> pending_signature -> submitted -> confirmed -> completed -> failed`

### 9.5 NFT 持仓状态

`active -> cooling -> transferred -> redeemed -> frozen`

---

## 10. 实时能力建议

以下场景建议使用 SSE 或 WebSocket：

1. 全局优先队列实时刷新
2. 我的排队名次变化
3. NFT 订单状态变化
4. Check-in Payment 状态变化
5. 链上确认后的前端自动刷新

建议提供：

- `GET /api/v1/stream/queue`
- `GET /api/v1/stream/orders`
- `GET /api/v1/stream/payments`

---

## 11. 后端与链上同步建议

### 11.1 推荐架构

1. API Service：接收前端请求
2. DB：保存业务快照和订单状态
3. Chain Listener Worker：监听合约事件
4. Scheduler：做收益快照、队列重算、超时取消

### 11.2 同步策略

1. 前端提交交易后，后端先记录 `submitted`
2. Worker 根据 `tx_hash` 拉取链上确认结果
3. 解析事件后，更新业务表
4. 写入 `chain_events`
5. 推送前端刷新

### 11.3 幂等规则

必须保证以下字段唯一：

- `tx_hash`
- `tx_hash + event_index`
- `business_order_id`

---

## 12. 推荐开发顺序

### 第一阶段：先支撑前端静态联调

1. 钱包登录
2. 设施列表 / 详情
3. Dashboard summary
4. 持仓列表
5. 队列列表

### 第二阶段：接入关键业务闭环

1. NFT quote / order
2. Admission preview / submit
3. Burn preview / submit
4. Check-in payment

### 第三阶段：接入链上同步与实时推送

1. 订单状态回写
2. 队列实时刷新
3. 收益快照任务
4. 活动历史流

---

## 13. MVP 最小接口集

如果先做 MVP，建议至少实现以下接口：

1. `POST /api/v1/auth/challenge`
2. `POST /api/v1/auth/verify`
3. `GET /api/v1/facilities`
4. `GET /api/v1/facilities/:id`
5. `GET /api/v1/facilities/:id/assets`
6. `GET /api/v1/portfolio/summary`
7. `GET /api/v1/nft-holdings`
8. `POST /api/v1/nft-orders/quote`
9. `POST /api/v1/queue-applications/preview`
10. `POST /api/v1/queue-applications`
11. `POST /api/v1/queue-burn-orders/preview`
12. `POST /api/v1/queue-burn-orders`
13. `GET /api/v1/queue/global`
14. `POST /api/v1/payments/check-in/preview`
15. `POST /api/v1/payments/check-in`

---

## 14. 结论

基于现有原型，CareChain 后端不应只做简单的 CRUD，而应承担“页面聚合层 + 业务编排层 + 链上状态同步层”的职责。

如果以后端可维护性为目标，建议：

1. 前端只依赖后端统一接口，不直接拼装链上原始字段
2. 所有链上动作统一走订单化设计
3. 所有展示型统计统一由后端聚合
4. Priority Queue 和 Payment 必须按状态机实现

这样可以保证前端原型中的页面在进入真实联调阶段时，不会因为链上复杂度而频繁改接口。
