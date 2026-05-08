# CareChain 动态 NFT 元数据架构 (中心化 API 方案)

本方案基于**第一性原理**和 **KISS（极简）原则**设计。抛弃了传统静态 NFT（如小图片）需要预先向 IPFS 上传不可变 JSON 的繁琐流程，将 Solana 链本身作为唯一的只读数据库（Source of Truth）。

---

## 1. 架构核心思想

- **链上状态即一切**：设施 ID（`facility_id`）、床位 ID（`bed_class_id`）和当前模式（`mode`）在铸造时已经被安全地存储在了 `BedPosition` 这个链上账户（PDA）中。
- **动态 URI**：智能合约在 Mint 时，不再把 URI 写死成 Pinata 链接，而是写入一条包含 Mint 地址的 API 路径，例如：`https://api.carechain.com/metadata/{mint_key}`。
- **后端无状态化**：Node.js 后端不需要数据库（不用建表存 NFT 信息），它仅仅扮演一个“链上数据翻译器”的角色。

---

## 2. 完整的端到端工作流

### 流程一：铸造阶段 (与后端无关)
1. 用户在前端页面点击 Mint。
2. 前端向 Solana 发送交易，调用智能合约的 `mint_bedright_nft`。
3. 合约执行：扣除 USDC -> 生成 NFT -> 记录 `BedPosition` 数据 -> 将 Metadata URI 设置为 `https://api.carechain.com/metadata/<当前Mint地址>`。
*（在这个阶段，Node.js 后端完全无需工作，没有任何 API 调用）*

### 流程二：钱包请求与后端处理阶段 (核心流程)
1. **触发请求**：当用户打开 Phantom 钱包，或者在 Web3 浏览器中查看自己的 NFT 列表时，钱包会自动读取该 NFT 的元数据（Metadata 账户）。
2. **发起 GET 请求**：钱包读到了 `uri` 字段，随后静默地向你的 Node.js 服务器发起一个普通的 HTTP GET 请求，例如：
   `GET https://api.carechain.com/metadata/8A2B...` (假设 `8A2B...` 是 Mint 地址)。
3. **后端拦截提取**：Node.js 接收到请求，从 URL 中提取出动态参数 `mint_address`。
4. **后端推导 PDA 地址**：
   Node.js 利用 Solana Web3.js 库，通过 `mint_address` 和 `PROGRAM_ID` 算出对应的 `BedPosition` 账户地址。
5. **后端拉取链上数据**：
   Node.js 向 Solana RPC 发起查询，读取该 `BedPosition` 账户的实时数据。此时拿到了最新的 `facility_id`、`bed_class_id` 和 `mode`。
6. **动态生成 JSON**：
   Node.js 立即在内存中组装出一个符合 Metaplex 标准的 JSON 对象。

### 流程三：展示阶段
1. **返回响应**：Node.js 将组装好的 JSON 通过 HTTP Response (状态码 200) 返回给钱包。
2. **钱包渲染**：钱包解析 JSON 文件，完美地在用户界面上展示出“设备 ID”、“床位 ID”、“当前模式”以及 NFT 图片。

---

## 3. 为什么这是最优秀的解法？

假设未来用户在智能合约里触发了 `switch_mode` 指令，把床位从 `Yield` 变成了 `Usage`：
- **如果是存在 IPFS 上的传统做法**：你需要重新生成 JSON -> 传到 Pinata -> 拿到新 CID -> 发起上链交易去更新 Metadata 账户 -> 消耗 SOL 矿工费。
- **现在的方案**：由于链上 `BedPosition` 里的 `mode` 已经变了，下次用户打开钱包，钱包重新请求 API，Node.js 查到的就是新的状态，瞬间返回新的 JSON。**零成本、零延迟、永远与链上状态保持 100% 一致。**

---

## 4. Node.js 后端伪代码参考

以下是在 Express 或 Next.js 中极简实现该逻辑的代码骨架：

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
// 引入你的 IDL
import carechainIdl from './carechain.json'; 

const connection = new Connection("https://api.devnet.solana.com");
const PROGRAM_ID = new PublicKey("你的合约ID");

// 你的 API 路由入口 (比如 GET /metadata/:mint)
export async function getMetadata(req, res) {
  const { mint } = req.params; // 从请求路径中拿到 mint_address

  try {
    const program = new Program(carechainIdl, connection);

    // 1. 推导 PDA 
    const [bedPositionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bed_position"), new PublicKey(mint).toBuffer()],
      PROGRAM_ID
    );

    // 2. 去链上拉取真实数据
    const bedPositionData = await program.account.bedPosition.fetch(bedPositionPda);

    // 3. 组装 JSON 返回
    const metadataJson = {
      name: "BED",
      symbol: "BED",
      description: "CareChain BedRight NFT - tokenized healthcare bed ownership.",
      // 图片本身一般不会变，所以依然可以放一个静态的 Pinata 链接
      image: "https://beige-capitalist-xerinae-88.mypinata.cloud/ipfs/bafy...", 
      attributes: [
        { trait_type: "Device ID", value: bedPositionData.facilityId },
        { trait_type: "Bed ID", value: bedPositionData.bedClassId },
        { trait_type: "Mode", value: Object.keys(bedPositionData.mode)[0] } // 提取 Yield 或 Usage
      ]
    };

    return res.status(200).json(metadataJson);

  } catch (error) {
    console.error("查询链上数据失败", error);
    // 如果还没创建或者查不到，返回一个默认的占位 JSON 或者 404
    return res.status(404).json({ error: "NFT not found on-chain" });
  }
}
```
