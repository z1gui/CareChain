# CareChain API & Data Interaction Spec (MVP)

## 1. 文档目标

本文件用于统一以下三部分的交互标准：

1. 前端 ↔ 后端
2. 后端 ↔ 合约
3. 数据对象与字段定义

适用范围：CareChain 黑客松 MVP

---

## 2. MVP 核心链路

### 2.1 投资者链路
1. 用户连接钱包
2. 浏览设施和床位类型
3. 使用 USDC 购买 BedRight NFT
4. 查看 NFT 持仓
5. 查看可领取收益
6. 领取收益

### 2.2 普通家庭链路
1. 提交入住申请
2. 进入 P3 队列
3. 查看当前等待状态
4. 燃烧 $CARE
5. 升级到 P2 通道

### 2.3 管理员链路
1. 注入 SOL 收益
2. 更新设施 occupancy
3. 释放床位
4. 按优先级分配床位
5. 确认入住结果

---

## 3. 系统职责划分

### 前端
负责：
- 页面展示
- 用户输入
- 钱包签名
- 交易提交
- 状态轮询与反馈

### 后端
负责：
- 聚合链上/链下数据
- 生成交易参数
- 管理非钱包用户申请
- 提供 mock oracle / admin 接口
- 维护数据库

### 合约
负责：
- BedRight NFT 资产状态
- 收益分发逻辑
- 队列优先级状态
- CARE 销毁与升级
- 床位分配结果

### MVP 取舍说明
- `allocate_next_bed` 不做链上全局候选人排序，也不会在链上自动扫描 `P1 -> P2 -> P3`
- 候选人由后端 / admin 侧先选出，合约只校验目标 `QueueEntry` 是否合法并更新状态
- pricing 链上只维护 `multiplier` 与 `burn_price_per_day` 的当前值，不维护完整历史价格表或整张规则表
- 当前仓库里的 Queue TypeScript 集成测试仍是脚手架阶段；在本地未安装 JS 测试二进制时，MVP 以 Rust 单测 + 文档联调约定为主

---

## 4. 统一响应格式

### 成功响应
```json
{
  "success": true,
  "message": "optional message",
  "data": {},
  "error": null
}
```
### 失败响应
```
{
  "success": false,
  "message": "Queue upgrade failed",
  "data": null,
  "error": {
    "code": "QUEUE_UPGRADE_FAILED",
    "details": "Applicant is not in P3"
  }
}
```


⸻

## 5. 核心数据结构

### 5.1 Facility
```
type Facility = {
  facility_id: string;
  facility_name: string;
  city: string;
  total_beds: number;
  sold_nfts: number;
  occupancy_rate: number; // 0 ~ 1
  admin_wallet: string;
  treasury_usdc_ata: string;
};
```
### 5.2 BedClass
```
type BedClass = {
  bed_class_id: string;
  facility_id: string;
  room_type: string;
  care_tier: string;
  price_usdc: number;
  apy_bps: number;
  total_supply: number;
  minted_supply: number;
  privilege_level: string;
};
```
### 5.3 BedPosition
```
type BedPosition = {
  mint: string;
  owner: string;
  facility_id: string;
  bed_class_id: string;
  mode: "yield" | "occupancy";
  last_mode_switch_ts: number;
  active: boolean;
};
```
### 5.4 YieldPosition
```
type YieldPosition = {
  mint: string;
  owner: string;
  claimable_lamports: number;
  claimed_lamports: number;
  care_boost_bps: number;
  last_claim_ts: number;
};
```
### 5.5 QueueState
```
type QueueState = {
  facility_id: string;
  p1_count: number;
  p2_count: number;
  p3_count: number;
  multiplier: number;
  burn_price_per_day: number;
  updated_at: number;
};
```
### 5.6 QueueEntry
```
type QueueEntry = {
  applicant_id: string;
  facility_id: string;
  wallet?: string;
  lane: "P1" | "P2" | "P3";
  queue_no: number;
  burn_amount: number;
  status: "waiting" | "invited" | "admitted" | "cancelled";
  estimated_wait_days?: number;
  created_at: number;
};
```
### 5.7 YieldSnapshot
```
type YieldSnapshot = {
  snapshot_id: string;
  facility_id: string;
  amount_lamports: number;
  source: "facility_income" | "care_burn_bonus";
  timestamp: number;
};
```
### 5.8 TxPayload
```
type TxPayload = {
  tx_type: string;
  program_id: string;
  accounts: Record<string, string>;
  args: Record<string, string | number | boolean>;
};
```

⸻

## 6. 链上字段 vs 链下字段

放链上
	•	facility_id
	•	bed_class_id
	•	mint
	•	owner
	•	mode
	•	price_usdc
	•	apy_bps
	•	queue lane
	•	burn_amount
	•	yield accounting
	•	admission status

放链下
	•	applicant name
	•	phone
	•	expected_checkin_date
	•	remarks
	•	图表快照
	•	admin 操作日志
	•	推荐理由

⸻

## 7. 前端 ↔ 后端 API

### 7.1 Facility 模块

#### #### GET /api/facility/summary

获取设施摘要信息。

##### Response
```
{
  "success": true,
  "data": {
    "facility_id": "foshan-001",
    "facility_name": "佛山乐颐养护中心",
    "city": "Foshan",
    "total_beds": 200,
    "sold_nfts": 68,
    "occupancy_rate": 0.72,
    "p3_queue_count": 24,
    "care_burn_price_per_day": 15,
    "care_burn_multiplier": 1.5
  }
}
```

⸻

#### #### GET /api/facility/bed-classes

获取床位类型列表。

##### Response
```
{
  "success": true,
  "data": [
    {
      "bed_class_id": "standard",
      "facility_id": "foshan-001",
      "room_type": "标准单人间",
      "care_tier": "生活自理型",
      "price_usdc": 500,
      "apy_bps": 650,
      "total_supply": 100,
      "minted_supply": 36,
      "privilege_level": "P1"
    }
  ]
}
```

⸻

### 7.2 NFT 模块

#### #### POST /api/nft/mint

创建 BedRight NFT 铸造交易参数。

##### Request
```
{
  "wallet": "USER_WALLET_ADDRESS",
  "facility_id": "foshan-001",
  "bed_class_id": "standard",
  "pay_token": "USDC"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "tx_type": "mint_bedright_nft",
    "program_id": "BEDRIGHT_PROGRAM_ID",
    "accounts": {
      "user": "USER_WALLET_ADDRESS",
      "facility": "FACILITY_PDA",
      "bed_class": "BED_CLASS_PDA",
      "bed_position": "BED_POSITION_PDA",
      "mint": "NEW_NFT_MINT",
      "user_usdc_ata": "USER_USDC_ATA",
      "treasury_usdc_ata": "TREASURY_USDC_ATA"
    },
    "args": {
      "facility_id": "foshan-001",
      "bed_class_id": "standard",
      "price_usdc": 500000000
    }
  }
}
```

⸻

#### GET /api/nft/my/:wallet

获取钱包持有的 BedRight NFT。

##### Response
```
{
  "success": true,
  "data": {
    "wallet": "USER_WALLET_ADDRESS",
    "positions": [
      {
        "mint": "NFT_MINT_1",
        "owner": "USER_WALLET_ADDRESS",
        "facility_id": "foshan-001",
        "bed_class_id": "standard",
        "mode": "yield",
        "last_mode_switch_ts": 1775000000,
        "active": true
      }
    ]
  }
}
```

⸻

#### POST /api/nft/switch-mode

切换 NFT 模式。

##### Request
```
{
  "wallet": "USER_WALLET_ADDRESS",
  "mint": "NFT_MINT_1",
  "target_mode": "occupancy"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "tx_type": "switch_mode",
    "program_id": "BEDRIGHT_PROGRAM_ID",
    "accounts": {
      "user": "USER_WALLET_ADDRESS",
      "bed_position": "BED_POSITION_PDA"
    },
    "args": {
      "mint": "NFT_MINT_1",
      "target_mode": "occupancy"
    }
  }
}
```

⸻

### 7.3 Yield 模块

#### GET /api/yield/my/:wallet

获取用户收益信息。

##### Response
```
{
  "success": true,
  "data": {
    "wallet": "USER_WALLET_ADDRESS",
    "total_claimable_lamports": 42600000000,
    "total_claimed_lamports": 108400000000,
    "positions": [
      {
        "mint": "NFT_MINT_1",
        "claimable_lamports": 20100000000,
        "claimed_lamports": 55000000000,
        "care_boost_bps": 100,
        "last_claim_ts": 1775000000
      }
    ],
    "history": [
      {
        "snapshot_id": "yield-20260401",
        "facility_id": "foshan-001",
        "amount_lamports": 18200000000,
        "source": "facility_income",
        "timestamp": 1775000000
      }
    ]
  }
}
```

⸻

#### POST /api/yield/claim

生成收益领取交易参数。

##### Request
```
{
  "wallet": "USER_WALLET_ADDRESS",
  "mint": "NFT_MINT_1"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "tx_type": "claim_yield",
    "program_id": "YIELD_VAULT_PROGRAM_ID",
    "accounts": {
      "user": "USER_WALLET_ADDRESS",
      "holder_position": "HOLDER_POSITION_PDA",
      "vault": "YIELD_VAULT_PDA"
    },
    "args": {
      "mint": "NFT_MINT_1"
    }
  }
}
```

⸻

#### POST /api/yield/deposit

管理员注入原生 SOL 收益。

##### Request
```
{
  "admin_wallet": "ADMIN_WALLET",
  "facility_id": "foshan-001",
  "amount_lamports": 100000000,
  "source": "facility_income"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "tx_type": "deposit_yield",
    "program_id": "YIELD_VAULT_PROGRAM_ID",
    "accounts": {
      "admin": "ADMIN_WALLET",
      "vault": "YIELD_VAULT_PDA"
    },
    "args": {
      "facility_id": "foshan-001",
      "amount_lamports": 100000000,
      "source": "facility_income"
    }
  }
}
```

⸻

### 7.4 Queue 模块

#### POST /api/queue/apply

普通家庭提交入住申请。

##### Request
```
{
  "name": "张三",
  "phone": "13800000000",
  "facility_id": "foshan-001",
  "expected_checkin_date": "2026-06-01"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "applicant_id": "app_001",
    "facility_id": "foshan-001",
    "lane": "P3",
    "queue_no": 25,
    "estimated_wait_days": 18,
    "status": "waiting"
  }
}
```

⸻

#### GET /api/queue/status/:applicant_id

查询申请状态。

##### Response
```
{
  "success": true,
  "data": {
    "applicant_id": "app_001",
    "facility_id": "foshan-001",
    "lane": "P3",
    "queue_no": 25,
    "burn_amount": 0,
    "status": "waiting",
    "estimated_wait_days": 18,
    "created_at": 1775000000
  }
}
```

⸻

#### GET /api/queue/pricing?facility_id=foshan-001

获取当前跳队价格规则。

MVP 说明：接口返回的是当前生效价格与前端展示所需规则说明；合约侧只存当前值，不维护完整链上 pricing table。

##### Response
```
{
  "success": true,
  "data": {
    "facility_id": "foshan-001",
    "p3_queue_count": 24,
    "multiplier": 1.5,
    "burn_price_per_day": 15,
    "rules": [
      { "min": 0, "max": 9, "multiplier": 1.0, "price": 10 },
      { "min": 10, "max": 50, "multiplier": 1.5, "price": 15 },
      { "min": 51, "max": 9999, "multiplier": 2.0, "price": 20 }
    ]
  }
}
```

⸻

#### POST /api/queue/burn-upgrade

燃烧 CARE 升级到 P2。

##### Request
```
{
  "wallet": "USER_WALLET_ADDRESS",
  "applicant_id": "app_001",
  "facility_id": "foshan-001",
  "burn_amount": 15000000000
}
```
##### Response
```
{
  "success": true,
  "data": {
    "tx_type": "burn_care_and_upgrade",
    "program_id": "PRIORITY_QUEUE_PROGRAM_ID",
    "accounts": {
      "user": "USER_WALLET_ADDRESS",
      "queue_state": "QUEUE_STATE_PDA",
      "queue_entry": "QUEUE_ENTRY_PDA",
      "care_mint": "CARE_MINT",
      "user_care_ata": "USER_CARE_ATA"
    },
    "args": {
      "applicant_id": "app_001",
      "burn_amount": 15000000000
    }
  }
}
```

⸻

### 7.5 Admin 模块

#### POST /api/oracle/occupancy

更新设施 occupancy。

##### Request
```
{
  "admin_wallet": "ADMIN_WALLET",
  "facility_id": "foshan-001",
  "occupancy_rate": 0.75
}

```
⸻

#### POST /api/admin/release-bed

释放一个床位。

##### Request
```
{
  "admin_wallet": "ADMIN_WALLET",
  "facility_id": "foshan-001",
  "bed_position": "BED_POSITION_PDA"
}
```

⸻

#### POST /api/admin/allocate

触发分配。

##### Request
```
{
  "admin_wallet": "ADMIN_WALLET",
  "facility_id": "foshan-001",
  "applicant_id": "app_001"
}
```
##### Response
```
{
  "success": true,
  "data": {
    "allocated_to": "app_001",
    "lane": "P2",
    "status": "invited"
  }
}
```

MVP 说明：候选人先由后端 / admin 根据业务规则选出，再调用 `allocate_next_bed`。合约只校验该申请条目属于目标设施、仍处于 `waiting`，并把状态更新为 `invited`。

⸻

## 8. 后端 ↔ 合约交互规范

### 8.1 BedRight Program

initialize_facility
```
type InitializeFacilityArgs = {
  facilityId: string;
  name: string;
  totalBeds: number;
  city: string;
};
```
create_bed_class
```
type CreateBedClassArgs = {
  facilityId: string;
  bedClassId: string;
  roomType: string;
  careTier: string;
  priceUsdc: bigint;
  apyBps: number;
  totalSupply: number;
  privilegeLevel: string;
};
```
mint_bedright_nft
```
type MintBedRightArgs = {
  facilityId: string;
  bedClassId: string;
  priceUsdc: bigint;
};
```
switch_mode
```
type SwitchModeArgs = {
  mint: string;
  targetMode: "yield" | "occupancy";
};
```

⸻

### 8.2 YieldVault Program

deposit_yield
```
type DepositYieldArgs = {
  facilityId: string;
  amountUsdc: bigint;
  source: "facility_income" | "care_burn_bonus";
};
```
claim_yield
```
type ClaimYieldArgs = {
  mint: string;
};
```

⸻

### 8.3 PriorityQueue Program

join_p3_queue
```
type JoinP3Args = {
  facilityId: string;
  applicantId: string;
};
```
register_p1_from_nft
```
type RegisterP1Args = {
  facilityId: string;
  wallet: string;
  mint: string;
};
```
burn_care_and_upgrade
```
type BurnUpgradeArgs = {
  applicantId: string;
  burnAmount: bigint;
};
```
allocate_next_bed
```
type AllocateNextBedArgs = {
  facilityId: string;
  applicantId: string;
};
```
confirm_admission
```
type ConfirmAdmissionArgs = {
  facilityId: string;
  applicantId: string;
  bedPosition: string;
};
```

⸻

## 9. 数据库建议表

facilities
	•	id
	•	name
	•	city
	•	total_beds
	•	sold_nfts
	•	occupancy_rate
	•	admin_wallet

bed_classes
	•	id
	•	facility_id
	•	room_type
	•	care_tier
	•	price_usdc
	•	apy_bps
	•	total_supply
	•	minted_supply
	•	privilege_level

applicants
	•	id
	•	name
	•	phone
	•	facility_id
	•	lane
	•	burn_amount
	•	status
	•	expected_checkin_date
	•	created_at

yield_snapshots
	•	id
	•	facility_id
	•	amount_lamports
	•	source
	•	timestamp

admissions
	•	id
	•	applicant_id
	•	facility_id
	•	lane
	•	bed_position
	•	status
	•	admitted_at

⸻

## 10. 推荐联调顺序

第一阶段
	•	#### GET /api/facility/summary
	•	#### GET /api/facility/bed-classes
	•	#### POST /api/nft/mint
	•	#### GET /api/nft/my/:wallet

第二阶段
	•	#### POST /api/yield/deposit
	•	#### GET /api/yield/my/:wallet
	•	#### POST /api/yield/claim

第三阶段
	•	#### POST /api/queue/apply
	•	#### GET /api/queue/pricing
	•	#### POST /api/queue/burn-upgrade

第四阶段
	•	#### POST /api/admin/release-bed
	•	#### POST /api/admin/allocate
	•	#### GET /api/queue/status/:applicant_id

⸻

## 11. 错误码建议

NFT
	•	NFT_SOLD_OUT
	•	INVALID_BED_CLASS
	•	INSUFFICIENT_USDC
	•	NFT_MINT_FAILED

Yield
	•	VAULT_NOT_INITIALIZED
	•	NO_CLAIMABLE_YIELD
	•	CLAIM_FAILED
	•	INVALID_POSITION

Queue
	•	APPLICANT_NOT_FOUND
	•	APPLICANT_NOT_IN_P3
	•	INSUFFICIENT_CARE
	•	QUEUE_UPGRADE_FAILED
	•	ALLOCATION_FAILED

Admin
	•	UNAUTHORIZED_ADMIN
	•	BED_NOT_AVAILABLE
	•	OCCUPANCY_UPDATE_FAILED

⸻

## 12. 黑客松最小必须跑通的接口

NFT
	•	 GET /api/facility/summary
	•	 GET /api/facility/bed-classes
	•	 POST /api/nft/mint
	•	 GET /api/nft/my/:wallet

Yield
	•	 POST /api/yield/deposit
	•	 GET /api/yield/my/:wallet
	•	 POST /api/yield/claim

Queue
	•	 POST /api/queue/apply
	•	 GET /api/queue/pricing
	•	 POST /api/queue/burn-upgrade

Admin
	•	 POST /api/admin/release-bed
	•	 POST /api/admin/allocate

⸻

## 13. 结论

MVP 联调的核心对象只有三个：
	•	BedPosition
	•	YieldPosition
	•	QueueEntry
