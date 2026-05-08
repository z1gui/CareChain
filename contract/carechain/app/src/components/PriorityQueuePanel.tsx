import { useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider, utils } from '@coral-xyz/anchor'
import { BN } from 'bn.js'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'

import { CARECHAIN_PROGRAM_ID, getPriorityQueueProgram } from '../anchor/setup'
import { DEVNET_RPC_LABEL, LOCAL_RPC_ENDPOINT, type RpcMode } from '../config/rpc'

export default function PriorityQueuePanel() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [rpcMode, setRpcMode] = useState<RpcMode>('devnet')
  const [facilityId, setFacilityId] = useState('FAC-001')
  const [applicantId, setApplicantId] = useState('APP-001')
  const [burnPricePerDay, setBurnPricePerDay] = useState('10')
  const [facilityPdaInput, setFacilityPdaInput] = useState('')
  const [mintInput, setMintInput] = useState('')
  const [status, setStatus] = useState('等待执行')

  const localConnection = useMemo(
    () => new Connection(LOCAL_RPC_ENDPOINT, 'confirmed'),
    []
  )

  const activeConnection = rpcMode === 'local' ? localConnection : connection

  const withProgram = () => {
    if (!wallet.publicKey) {
      throw new Error('请先连接钱包')
    }

    const provider = new AnchorProvider(activeConnection, wallet as never, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    })

    return getPriorityQueueProgram(provider)
  }

  const deriveQueueStatePda = (programId: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('queue_state'), utils.bytes.utf8.encode(facilityId)],
      programId
    )[0]

  const deriveQueueEntryPda = (programId: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('queue_entry'),
        utils.bytes.utf8.encode(facilityId),
        utils.bytes.utf8.encode(applicantId),
      ],
      programId
    )[0]

  const deriveBedPositionPda = (mint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('bed_position'), mint.toBuffer()],
      CARECHAIN_PROGRAM_ID
    )[0]

  const resolveFacilityAccount = () => {
    if (facilityPdaInput.trim()) {
      return new PublicKey(facilityPdaInput.trim())
    }

    throw new Error('请填入 Facility PDA 地址')
  }

  const handleInitializeQueue = async () => {
    try {
      setStatus('正在初始化 Queue...')
      const program = withProgram()
      const queueStatePda = deriveQueueStatePda(program.programId)
      const facility = resolveFacilityAccount()

      const tx = await program.methods
        .initializeQueue(facilityId, new BN(burnPricePerDay))
        .accounts({
          admin: wallet.publicKey!,
          facility,
          queueState: queueStatePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setStatus(`Queue 初始化成功: ${tx.slice(0, 8)}...`)
    } catch (err: any) {
      console.error(err)
      setStatus(`初始化失败: ${err.message}`)
    }
  }

  const handleJoinP3 = async () => {
    try {
      setStatus('正在加入 P3 队列...')
      const program = withProgram()
      const queueStatePda = deriveQueueStatePda(program.programId)
      const queueEntryPda = deriveQueueEntryPda(program.programId)

      const tx = await program.methods
        .joinP3Queue(facilityId, applicantId)
        .accounts({
          applicant: wallet.publicKey!,
          queueState: queueStatePda,
          queueEntry: queueEntryPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setStatus(`P3 入队成功: ${tx.slice(0, 8)}...`)
    } catch (err: any) {
      console.error(err)
      setStatus(`入队失败: ${err.message}`)
    }
  }

  const handleAllocate = async () => {
    try {
      setStatus('正在分配床位邀请...')
      const program = withProgram()
      const queueStatePda = deriveQueueStatePda(program.programId)
      const queueEntryPda = deriveQueueEntryPda(program.programId)

      const tx = await program.methods
        .allocateNextBed(facilityId, applicantId)
        .accounts({
          admin: wallet.publicKey!,
          queueState: queueStatePda,
          queueEntry: queueEntryPda,
        })
        .rpc()

      setStatus(`分配成功: ${tx.slice(0, 8)}...`)
    } catch (err: any) {
      console.error(err)
      setStatus(`分配失败: ${err.message}`)
    }
  }

  const handleConfirmAdmission = async () => {
    try {
      if (!mintInput.trim()) {
        throw new Error('请填入 BedRight NFT Mint 地址')
      }

      setStatus('正在确认入住...')
      const program = withProgram()
      const queueStatePda = deriveQueueStatePda(program.programId)
      const queueEntryPda = deriveQueueEntryPda(program.programId)
      const mint = new PublicKey(mintInput.trim())
      const bedPositionPda = deriveBedPositionPda(mint)

      const tx = await program.methods
        .confirmAdmission(facilityId, applicantId)
        .accounts({
          admin: wallet.publicKey!,
          queueState: queueStatePda,
          queueEntry: queueEntryPda,
          bedrightProgram: CARECHAIN_PROGRAM_ID,
          bedPosition: bedPositionPda,
        })
        .rpc()

      setStatus(`入住确认成功: ${tx.slice(0, 8)}...`)
    } catch (err: any) {
      console.error(err)
      setStatus(`确认失败: ${err.message}`)
    }
  }

  return (
    <div className="glass-panel">
      <div className="title">
        🚦 <span className="title-accent">Priority Queue Panel</span>
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
          <input className="input-field" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Applicant ID</label>
          <input className="input-field" value={applicantId} onChange={(e) => setApplicantId(e.target.value)} />
        </div>

        <div className="form-group">
          <label>初始 Burn Price / Day</label>
          <input
            className="input-field"
            type="number"
            value={burnPricePerDay}
            onChange={(e) => setBurnPricePerDay(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Facility PDA</label>
          <input
            className="input-field"
            value={facilityPdaInput}
            placeholder="初始化 Facility 后填入对应 PDA"
            onChange={(e) => setFacilityPdaInput(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>BedRight NFT Mint</label>
          <input
            className="input-field"
            value={mintInput}
            placeholder="Confirm Admission 时需要"
            onChange={(e) => setMintInput(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button className="btn-primary" onClick={handleInitializeQueue} disabled={!wallet.publicKey}>
          Initialize Queue
        </button>
        <button className="btn-primary" onClick={handleJoinP3} disabled={!wallet.publicKey}>
          Join P3
        </button>
        <button className="btn-primary" onClick={handleAllocate} disabled={!wallet.publicKey}>
          Allocate Bed
        </button>
        <button className="btn-primary" onClick={handleConfirmAdmission} disabled={!wallet.publicKey}>
          Confirm Admission
        </button>
      </div>

      <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <div>当前连接: {rpcMode === 'local' ? LOCAL_RPC_ENDPOINT : DEVNET_RPC_LABEL}</div>
        <div>最近状态: {status}</div>
      </div>
    </div>
  )
}
