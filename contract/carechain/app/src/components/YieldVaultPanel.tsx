import { useMemo, useState } from 'react'
import { AnchorProvider, BN, utils } from '@coral-xyz/anchor'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import {
  CARECHAIN_PROGRAM_ID,
  YIELD_VAULT_PROGRAM_ID,
  getYieldVaultProgram,
} from '../anchor/setup'
import { DEVNET_RPC_LABEL, LOCAL_RPC_ENDPOINT, type RpcMode } from '../config/rpc'

type YieldPositionSnapshot = {
  claimableLamports: bigint
  claimedLamports: bigint
  active: boolean
}

type FacilityYieldPoolSnapshot = {
  pendingUnallocatedLamports: bigint
  totalClaimedLamports: bigint
  totalDepositedLamports: bigint
  totalAllocatedLamports: bigint
}

function readAnchorString(data: Buffer, offset: number) {
  const length = data.readUInt32LE(offset)
  const start = offset + 4
  return {
    value: data.subarray(start, start + length).toString('utf8'),
    nextOffset: start + length,
  }
}

function decodeYieldPositionState(data: Buffer): YieldPositionSnapshot {
  let offset = 8
  offset += 32
  offset += 32
  offset = readAnchorString(data, offset).nextOffset
  offset += 32

  const claimableLamports = data.readBigUInt64LE(offset)
  offset += 8
  const claimedLamports = data.readBigUInt64LE(offset)
  offset += 8
  offset += 2
  offset += 8
  offset += 8
  const active = data.readUInt8(offset) === 1

  return { claimableLamports, claimedLamports, active }
}

function decodeFacilityYieldPoolState(data: Buffer): FacilityYieldPoolSnapshot {
  let offset = 8
  offset = readAnchorString(data, offset).nextOffset
  offset += 32
  offset += 32

  const totalDepositedLamports = data.readBigUInt64LE(offset)
  offset += 8
  const totalAllocatedLamports = data.readBigUInt64LE(offset)
  offset += 8
  const totalClaimedLamports = data.readBigUInt64LE(offset)
  offset += 8
  const pendingUnallocatedLamports = data.readBigUInt64LE(offset)

  return {
    pendingUnallocatedLamports,
    totalClaimedLamports,
    totalDepositedLamports,
    totalAllocatedLamports,
  }
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function shortAddress(value: PublicKey | string) {
  const text = typeof value === 'string' ? value : value.toBase58()
  return `${text.slice(0, 8)}...${text.slice(-8)}`
}

export default function YieldVaultPanel() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [rpcMode, setRpcMode] = useState<RpcMode>('devnet')
  const [facilityId, setFacilityId] = useState('FAC-001')
  const [facilityPdaInput, setFacilityPdaInput] = useState('')
  const [mintInput, setMintInput] = useState('')
  const [snapshotId, setSnapshotId] = useState(`SNAP-${Date.now()}`)
  const [depositLamports, setDepositLamports] = useState('2000000')
  const [allocateLamports, setAllocateLamports] = useState('1250000')
  const [status, setStatus] = useState('等待执行')
  const [lastSignature, setLastSignature] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [positionState, setPositionState] = useState<YieldPositionSnapshot | null>(null)
  const [poolState, setPoolState] = useState<FacilityYieldPoolSnapshot | null>(null)

  const localConnection = useMemo(
    () => new Connection(LOCAL_RPC_ENDPOINT, 'confirmed'),
    []
  )

  const activeConnection = rpcMode === 'local' ? localConnection : connection

  const deriveYieldVaultPda = () =>
    PublicKey.findProgramAddressSync([utils.bytes.utf8.encode('yield_vault')], YIELD_VAULT_PROGRAM_ID)[0]

  const deriveFacilityYieldPoolPda = () =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('facility_yield_pool'), utils.bytes.utf8.encode(facilityId)],
      YIELD_VAULT_PROGRAM_ID
    )[0]

  const deriveYieldPositionPda = (mint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('yield_position'), mint.toBuffer()],
      YIELD_VAULT_PROGRAM_ID
    )[0]

  const deriveYieldDistributionPda = () =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('yield_distribution'), utils.bytes.utf8.encode(snapshotId)],
      YIELD_VAULT_PROGRAM_ID
    )[0]

  const deriveBedPositionPda = (mint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('bed_position'), mint.toBuffer()],
      CARECHAIN_PROGRAM_ID
    )[0]

  const derivedMint = mintInput.trim() ? new PublicKey(mintInput.trim()) : null
  const derivedAddresses = {
    yieldVaultPda: deriveYieldVaultPda(),
    facilityYieldPoolPda: deriveFacilityYieldPoolPda(),
    yieldDistributionPda: deriveYieldDistributionPda(),
    bedPositionPda: derivedMint ? deriveBedPositionPda(derivedMint) : null,
    yieldPositionPda: derivedMint ? deriveYieldPositionPda(derivedMint) : null,
  }

  const withProgram = () => {
    if (!wallet.publicKey) {
      throw new Error('请先连接钱包')
    }

    const provider = new AnchorProvider(activeConnection, wallet as never, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    })

    return getYieldVaultProgram(provider)
  }

  const requireFacility = () => {
    if (!facilityPdaInput.trim()) {
      throw new Error('请填入 Facility PDA 地址')
    }

    return new PublicKey(facilityPdaInput.trim())
  }

  const requireMint = () => {
    if (!mintInput.trim()) {
      throw new Error('请填入 BedRight NFT Mint 地址')
    }

    return new PublicKey(mintInput.trim())
  }

  const requirePositiveBn = (value: string, fieldName: string) => {
    if (!/^\d+$/.test(value.trim())) {
      throw new Error(`${fieldName} 必须是正整数`)
    }

    const parsed = new BN(value.trim())
    if (parsed.lten(0)) {
      throw new Error(`${fieldName} 必须大于 0`)
    }

    return parsed
  }

  const runAction = async (label: string, action: () => Promise<string | void>) => {
    try {
      setIsRunning(true)
      setStatus(`${label} 执行中...`)
      const signature = await action()
      if (signature) {
        setLastSignature(signature)
        setStatus(`${label} 成功: ${shortAddress(signature)}`)
      } else {
        setStatus(`${label} 成功`)
      }
      return signature
    } catch (error) {
      console.error(error)
      setStatus(`${label} 失败: ${formatError(error)}`)
      throw error
    } finally {
      setIsRunning(false)
    }
  }

  const refreshState = async () => {
    const poolInfo = await activeConnection.getAccountInfo(derivedAddresses.facilityYieldPoolPda, 'confirmed')
    setPoolState(poolInfo ? decodeFacilityYieldPoolState(poolInfo.data) : null)

    if (!derivedAddresses.yieldPositionPda) {
      setPositionState(null)
      return
    }

    const positionInfo = await activeConnection.getAccountInfo(derivedAddresses.yieldPositionPda, 'confirmed')
    setPositionState(positionInfo ? decodeYieldPositionState(positionInfo.data) : null)
  }

  const handleRefreshState = async () => {
    await runAction('刷新状态', async () => {
      await refreshState()
    })
  }

  const initializeVaultAndPool = async () => {
    const facility = requireFacility()
    const program = withProgram()

    const initVaultSignature = await program.methods
      .initializeYieldVault(CARECHAIN_PROGRAM_ID)
      .accounts({
        authority: wallet.publicKey!,
        yieldVault: derivedAddresses.yieldVaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    setLastSignature(initVaultSignature)

    const initPoolSignature = await program.methods
      .initializeFacilityYieldPool(facilityId)
      .accounts({
        authority: wallet.publicKey!,
        yieldVault: derivedAddresses.yieldVaultPda,
        facility,
        facilityYieldPool: derivedAddresses.facilityYieldPoolPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    await refreshState()
    return initPoolSignature
  }

  const initializeYieldPosition = async () => {
    const mint = requireMint()
    const program = withProgram()

    const signature = await program.methods
      .initializeYieldPosition(facilityId)
      .accounts({
        payer: wallet.publicKey!,
        yieldVault: derivedAddresses.yieldVaultPda,
        facilityYieldPool: derivedAddresses.facilityYieldPoolPda,
        mint,
        bedPosition: deriveBedPositionPda(mint),
        yieldPosition: deriveYieldPositionPda(mint),
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    await refreshState()
    return signature
  }

  const depositAndAllocate = async () => {
    const mint = requireMint()
    const program = withProgram()
    const depositAmount = requirePositiveBn(depositLamports, 'Deposit Lamports')
    const allocateAmount = requirePositiveBn(allocateLamports, 'Allocate Lamports')

    const depositSignature = await program.methods
      .depositYield(facilityId, depositAmount, { facilityIncome: {} }, snapshotId)
      .accounts({
        admin: wallet.publicKey!,
        yieldVault: derivedAddresses.yieldVaultPda,
        authority: wallet.publicKey!,
        facilityYieldPool: derivedAddresses.facilityYieldPoolPda,
        yieldDistributionRecord: derivedAddresses.yieldDistributionPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    setLastSignature(depositSignature)

    const allocateSignature = await program.methods
      .allocateYieldToPositions(facilityId, snapshotId, allocateAmount)
      .accounts({
        admin: wallet.publicKey!,
        facilityYieldPool: derivedAddresses.facilityYieldPoolPda,
        yieldDistributionRecord: derivedAddresses.yieldDistributionPda,
        yieldPosition: deriveYieldPositionPda(mint),
      })
      .rpc()

    await refreshState()
    return allocateSignature
  }

  const claimYield = async () => {
    const mint = requireMint()
    const program = withProgram()

    const signature = await program.methods
      .claimYield(mint)
      .accounts({
        user: wallet.publicKey!,
        yieldVault: derivedAddresses.yieldVaultPda,
        facilityYieldPool: derivedAddresses.facilityYieldPoolPda,
        yieldPosition: deriveYieldPositionPda(mint),
      })
      .rpc()

    await refreshState()
    return signature
  }

  const handleInitializeVaultAndPool = async () => {
    await runAction('Initialize Vault + Pool', initializeVaultAndPool)
  }

  const handleInitializeYieldPosition = async () => {
    await runAction('Initialize Yield Position', initializeYieldPosition)
  }

  const handleDepositAndAllocate = async () => {
    await runAction('Deposit + Allocate', depositAndAllocate)
  }

  const handleClaimYield = async () => {
    await runAction('Claim Yield', claimYield)
  }

  const handleRunFullFlow = async () => {
    await runAction('Run Full Flow', async () => {
      await initializeVaultAndPool()
      await initializeYieldPosition()
      await depositAndAllocate()
      await claimYield()
      await refreshState()
    })
  }

  return (
    <div className="glass-panel">
      <div className="title">
        💰 <span className="title-accent">Yield Vault Panel</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="form-group">
          <label>RPC 环境</label>
          <select
            className="input-field"
            value={rpcMode}
            onChange={(event) => setRpcMode(event.target.value as RpcMode)}
          >
            <option value="devnet">Devnet</option>
            <option value="local">Local Validator</option>
          </select>
        </div>

        <div className="form-group">
          <label>Facility ID</label>
          <input className="input-field" value={facilityId} onChange={(event) => setFacilityId(event.target.value)} />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Facility PDA</label>
          <input
            className="input-field"
            value={facilityPdaInput}
            placeholder="Initialize Facility 后填入"
            onChange={(event) => setFacilityPdaInput(event.target.value)}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>BedRight NFT Mint</label>
          <input
            className="input-field"
            value={mintInput}
            placeholder="已有 BedRight NFT Mint 地址"
            onChange={(event) => setMintInput(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Snapshot ID</label>
          <input className="input-field" value={snapshotId} onChange={(event) => setSnapshotId(event.target.value)} />
        </div>

        <div className="form-group">
          <label>Deposit Lamports</label>
          <input
            className="input-field"
            type="number"
            value={depositLamports}
            onChange={(event) => setDepositLamports(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Allocate Lamports</label>
          <input
            className="input-field"
            type="number"
            value={allocateLamports}
            onChange={(event) => setAllocateLamports(event.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <button className="btn-primary" onClick={handleInitializeVaultAndPool} disabled={!wallet.publicKey || isRunning}>
          Initialize Vault + Pool
        </button>
        <button className="btn-primary" onClick={handleInitializeYieldPosition} disabled={!wallet.publicKey || isRunning}>
          Initialize Yield Position
        </button>
        <button className="btn-primary" onClick={handleDepositAndAllocate} disabled={!wallet.publicKey || isRunning}>
          Deposit + Allocate
        </button>
        <button className="btn-primary" onClick={handleClaimYield} disabled={!wallet.publicKey || isRunning}>
          Claim Yield
        </button>
        <button className="btn-primary" onClick={handleRefreshState} disabled={isRunning}>
          Refresh State
        </button>
        <button className="btn-primary" onClick={handleRunFullFlow} disabled={!wallet.publicKey || isRunning}>
          Run Full Flow
        </button>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <div>当前连接: {rpcMode === 'local' ? LOCAL_RPC_ENDPOINT : DEVNET_RPC_LABEL}</div>
        <div>最近状态: {status}</div>
        <div>最近交易: {lastSignature ? shortAddress(lastSignature) : '暂无'}</div>
      </div>

      <div style={{ marginTop: '14px', fontSize: '13px', lineHeight: 1.7, wordBreak: 'break-all' }}>
        <div>Yield Vault PDA: {derivedAddresses.yieldVaultPda.toBase58()}</div>
        <div>Facility Pool PDA: {derivedAddresses.facilityYieldPoolPda.toBase58()}</div>
        <div>Yield Distribution PDA: {derivedAddresses.yieldDistributionPda.toBase58()}</div>
        <div>Bed Position PDA: {derivedAddresses.bedPositionPda?.toBase58() ?? '请先填写 Mint'}</div>
        <div>Yield Position PDA: {derivedAddresses.yieldPositionPda?.toBase58() ?? '请先填写 Mint'}</div>
      </div>

      <div style={{ marginTop: '14px', fontSize: '13px', lineHeight: 1.7 }}>
        <div>Pool Pending: {poolState ? poolState.pendingUnallocatedLamports.toString() : '未读取'}</div>
        <div>Pool Claimed: {poolState ? poolState.totalClaimedLamports.toString() : '未读取'}</div>
        <div>Pool Deposited: {poolState ? poolState.totalDepositedLamports.toString() : '未读取'}</div>
        <div>Pool Allocated: {poolState ? poolState.totalAllocatedLamports.toString() : '未读取'}</div>
        <div>Position Claimable: {positionState ? positionState.claimableLamports.toString() : '未读取'}</div>
        <div>Position Claimed: {positionState ? positionState.claimedLamports.toString() : '未读取'}</div>
        <div>Position Active: {positionState ? String(positionState.active) : '未读取'}</div>
      </div>
    </div>
  )
}
