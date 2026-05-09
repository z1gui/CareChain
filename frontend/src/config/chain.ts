/**
 * CareChain 业务配置层
 *
 * facilityId / applicantId / snapshotId 由业务层统一管理，
 * 避免前端各处硬编码导致与链上不一致。
 */

/** 默认设施 ID，需与链上 initializeFacility 时使用的值一致 */
export const DEFAULT_FACILITY_ID = 'foshan-01'

/** 用钱包地址作为 applicantId（如后端有统一生成逻辑，可替换） */
export function getApplicantId(walletAddress: string): string {
  return walletAddress
}

/** $CARE Token Mint 地址 — TODO: 替换为实际部署地址 */
export const CARE_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

/** 将 lamports 转为 SOL 字符串（保留 4 位小数） */
export function lamportsToSol(lamports: string | number | bigint): string {
  const n = typeof lamports === 'string' ? BigInt(lamports) : BigInt(lamports)
  const sol = Number(n) / 1e9
  return sol.toFixed(4)
}

/** 统一金额输入：前端传字符串，内部转 BN */
export function parseAmount(amount: string): bigint {
  return BigInt(amount)
}
