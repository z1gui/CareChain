import type { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getPriorityQueueProgram } from '@/anchor/setup'
import { DEFAULT_FACILITY_ID } from '@/config/chain'
import {
  carechainProgramId,
  deriveBedPositionPda,
  deriveQueueEntryPda,
  deriveQueueStatePda,
  TOKEN_PROGRAM_ID,
} from '@/utils/pda'
import { useAnchorProvider } from './use-anchor-provider'

type EmptyVariant = Record<string, never>

export function usePriorityQueueProgram() {
  const provider = useAnchorProvider()

  return useMemo(() => {
    if (!provider)
      return null
    return getPriorityQueueProgram(provider)
  }, [provider])
}

export function useQueueState(facilityId: string = DEFAULT_FACILITY_ID) {
  const program = usePriorityQueueProgram()

  return useQuery({
    queryKey: ['queueState', facilityId],
    queryFn: async () => {
      if (!program)
        throw new Error('Program not initialized')
      const pda = deriveQueueStatePda(facilityId)
      try {
        const account = await (program.account as any).queueState.fetch(pda)
        return account as {
          facilityId: string
          facility: PublicKey
          adminWallet: PublicKey
          p1Count: number
          p2Count: number
          p3Count: number
          nextQueueNo: BN
          multiplierBps: number
          burnPricePerDay: BN
          updatedAt: BN
          bump: number
        }
      }
      catch {
        return null
      }
    },
    enabled: !!program,
    refetchInterval: 10_000,
  })
}

export function useQueueEntry(facilityId: string = DEFAULT_FACILITY_ID, applicantId?: string) {
  const program = usePriorityQueueProgram()

  return useQuery({
    queryKey: ['queueEntry', facilityId, applicantId],
    queryFn: async () => {
      if (!program || !applicantId)
        throw new Error('Missing params')
      const pda = deriveQueueEntryPda(facilityId, applicantId)
      try {
        const account = await (program.account as any).queueEntry.fetch(pda)
        return account as {
          applicantId: string
          facilityId: string
          wallet: PublicKey | null
          mint: PublicKey | null
          lane: { p1?: EmptyVariant, p2?: EmptyVariant, p3?: EmptyVariant }
          queueNo: BN
          burnAmount: BN
          status: { waiting?: EmptyVariant, invited?: EmptyVariant, admitted?: EmptyVariant, cancelled?: EmptyVariant }
          bedPosition: PublicKey | null
          createdAt: BN
          updatedAt: BN
          bump: number
        }
      }
      catch {
        return null
      }
    },
    enabled: !!program && !!applicantId,
    refetchInterval: 10_000,
  })
}

export function useJoinP3Queue() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ facilityId, applicantId }: { facilityId: string, applicantId: string }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)

      try {
        await program.methods
          .joinP3Queue(facilityId, applicantId)
          .accounts({
            applicant: wallet,
            queueState: queueStatePda,
            queueEntry: queueEntryPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to join P3 queue')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}

export function useBurnCareAndUpgrade() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      applicantId,
      burnAmount,
      careMint,
      userCareAta,
    }: {
      facilityId: string
      applicantId: string
      /** 燃烧数量，字符串格式 */
      burnAmount: string
      careMint: PublicKey
      userCareAta: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)

      try {
        await program.methods
          .burnCareAndUpgrade(facilityId, applicantId, new BN(burnAmount))
          .accounts({
            applicant: wallet,
            queueState: queueStatePda,
            queueEntry: queueEntryPda,
            careMint,
            userCareAta,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to burn CARE and upgrade')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}

export function useRegisterP1FromNft() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      applicantId,
      mintAddress,
    }: {
      facilityId: string
      applicantId: string
      mintAddress: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)
      const bedPositionPda = deriveBedPositionPda(mintAddress)

      try {
        await program.methods
          .registerP1FromNft(facilityId, applicantId)
          .accounts({
            applicant: wallet,
            queueState: queueStatePda,
            bedrightProgram: carechainProgramId,
            mint: mintAddress,
            bedPosition: bedPositionPda,
            queueEntry: queueEntryPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to register P1 from NFT')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}

export function useAllocateNextBed() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ facilityId, applicantId }: { facilityId: string, applicantId: string }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)

      try {
        await program.methods
          .allocateNextBed(facilityId, applicantId)
          .accounts({
            admin: wallet,
            queueState: queueStatePda,
            queueEntry: queueEntryPda,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to allocate next bed')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}

export function useConfirmAdmission() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      applicantId,
      mintAddress,
    }: {
      facilityId: string
      applicantId: string
      /** 前端输入 mint，合约实际接收 bedPositionPda */
      mintAddress: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)
      const bedPositionPda = deriveBedPositionPda(mintAddress)

      try {
        await program.methods
          .confirmAdmission(facilityId, applicantId)
          .accounts({
            admin: wallet,
            queueState: queueStatePda,
            queueEntry: queueEntryPda,
            bedrightProgram: carechainProgramId,
            bedPosition: bedPositionPda,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to confirm admission')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}

export function useCancelQueueEntry() {
  const program = usePriorityQueueProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ facilityId, applicantId }: { facilityId: string, applicantId: string }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const queueStatePda = deriveQueueStatePda(facilityId)
      const queueEntryPda = deriveQueueEntryPda(facilityId, applicantId)

      try {
        await program.methods
          .cancelQueueEntry(facilityId, applicantId)
          .accounts({
            signer: wallet,
            queueState: queueStatePda,
            queueEntry: queueEntryPda,
          })
          .rpc()
      }
      catch (err: any) {
        throw new Error(err.message || 'Failed to cancel queue entry')
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['queueState', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['queueEntry', vars.facilityId, vars.applicantId] })
    },
  })
}
