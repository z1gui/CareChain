import type { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { SystemProgram } from '@solana/web3.js'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getYieldVaultProgram } from '@/anchor/setup'
import {
  carechainProgramId,
  deriveBedPositionPda,
  deriveFacilityPda,
  deriveFacilityYieldPoolPda,
  deriveYieldDistributionPda,
  deriveYieldPositionPda,
  deriveYieldVaultPda,
} from '@/utils/pda'
import { useAnchorProvider } from './use-anchor-provider'

type EmptyVariant = Record<string, never>

/* ------------------------------------------------------------------ */
/*  Program instance                                                    */
/* ------------------------------------------------------------------ */

export function useYieldVaultProgram() {
  const provider = useAnchorProvider()

  return useMemo(() => {
    if (!provider)
      return null
    return getYieldVaultProgram(provider)
  }, [provider])
}

/* ------------------------------------------------------------------ */
/*  Query hooks — 读取链上账户状态                                      */
/* ------------------------------------------------------------------ */

export function useYieldVault() {
  const program = useYieldVaultProgram()

  return useQuery({
    queryKey: ['yieldVault'],
    queryFn: async () => {
      if (!program)
        throw new Error('Program not initialized')
      const pda = deriveYieldVaultPda()
      try {
        const account = await (program.account as any).yieldVault.fetch(pda)
        return account as {
          authority: PublicKey
          bedrightProgramId: PublicKey
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

export function useFacilityYieldPool(facilityId: string) {
  const program = useYieldVaultProgram()

  return useQuery({
    queryKey: ['facilityYieldPool', facilityId],
    queryFn: async () => {
      if (!program)
        throw new Error('Program not initialized')
      const pda = deriveFacilityYieldPoolPda(facilityId)
      try {
        const account = await (program.account as any).facilityYieldPool.fetch(pda)
        return account as {
          facilityId: string
          facility: PublicKey
          adminWallet: PublicKey
          totalDepositedLamports: BN
          totalAllocatedLamports: BN
          totalClaimedLamports: BN
          pendingUnallocatedLamports: BN
          lastDepositTs: BN
          bump: number
        }
      }
      catch {
        return null
      }
    },
    enabled: !!program && !!facilityId,
    refetchInterval: 10_000,
  })
}

export function useYieldPosition(mint?: PublicKey) {
  const program = useYieldVaultProgram()

  return useQuery({
    queryKey: ['yieldPosition', mint?.toBase58()],
    queryFn: async () => {
      if (!program || !mint)
        throw new Error('Missing params')
      const pda = deriveYieldPositionPda(mint)
      try {
        const account = await (program.account as any).yieldPosition.fetch(pda)
        return account as {
          mint: PublicKey
          owner: PublicKey
          facilityId: string
          bedPosition: PublicKey
          claimableLamports: BN
          claimedLamports: BN
          careBoostBps: number
          lastClaimTs: BN
          lastAccrualTs: BN
          active: boolean
          bump: number
        }
      }
      catch {
        return null
      }
    },
    enabled: !!program && !!mint,
    refetchInterval: 10_000,
  })
}

export function useYieldDistribution(snapshotId?: string) {
  const program = useYieldVaultProgram()

  return useQuery({
    queryKey: ['yieldDistribution', snapshotId],
    queryFn: async () => {
      if (!program || !snapshotId)
        throw new Error('Missing params')
      const pda = deriveYieldDistributionPda(snapshotId)
      try {
        const account = await (program.account as any).yieldDistributionRecord.fetch(pda)
        return account as {
          snapshotId: string
          facilityId: string
          source: { facilityIncome?: EmptyVariant, careBurnBonus?: EmptyVariant }
          amountLamports: BN
          distributedPositionCount: number
          createdBy: PublicKey
          createdAt: BN
          bump: number
        }
      }
      catch {
        return null
      }
    },
    enabled: !!program && !!snapshotId,
    refetchInterval: 10_000,
  })
}

/* ------------------------------------------------------------------ */
/*  Batch query — 批量查询多个 NFT 收益仓位                              */
/* ------------------------------------------------------------------ */

export function useYieldPositions(mintAddresses: PublicKey[]) {
  const program = useYieldVaultProgram()

  return useQueries({
    queries: mintAddresses.map(mint => ({
      queryKey: ['yieldPosition', mint.toBase58()],
      queryFn: async () => {
        if (!program)
          throw new Error('Program not initialized')
        const pda = deriveYieldPositionPda(mint)
        try {
          const account = await (program.account as any).yieldPosition.fetch(pda)
          return account as {
            mint: PublicKey
            owner: PublicKey
            facilityId: string
            bedPosition: PublicKey
            claimableLamports: BN
            claimedLamports: BN
            careBoostBps: number
            lastClaimTs: BN
            lastAccrualTs: BN
            active: boolean
            bump: number
          }
        }
        catch {
          return null
        }
      },
      enabled: !!program && mintAddresses.length > 0,
      refetchInterval: 10_000,
    })),
  })
}

/* ------------------------------------------------------------------ */
/*  Mutation hooks — 写操作                                             */
/* ------------------------------------------------------------------ */

/** 步骤 1: 初始化全局收益金库 */
export function useInitializeYieldVault() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const yieldVaultPda = deriveYieldVaultPda()

      await program.methods
        .initializeYieldVault(carechainProgramId)
        .accounts({
          authority: wallet,
          yieldVault: yieldVaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yieldVault'] })
    },
  })
}

/** 步骤 2: 初始化设施收益池 */
export function useInitializeFacilityYieldPool() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ facilityId }: { facilityId: string }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const yieldVaultPda = deriveYieldVaultPda()
      const facilityPda = deriveFacilityPda(facilityId)
      const facilityYieldPoolPda = deriveFacilityYieldPoolPda(facilityId)

      await program.methods
        .initializeFacilityYieldPool(facilityId)
        .accounts({
          authority: wallet,
          yieldVault: yieldVaultPda,
          facility: facilityPda,
          facilityYieldPool: facilityYieldPoolPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facilityYieldPool', vars.facilityId] })
    },
  })
}

/** 步骤 3: 初始化 NFT 收益仓位 */
export function useInitializeYieldPosition() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      mintAddress,
    }: {
      facilityId: string
      mintAddress: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const yieldVaultPda = deriveYieldVaultPda()
      const facilityYieldPoolPda = deriveFacilityYieldPoolPda(facilityId)
      const bedPositionPda = deriveBedPositionPda(mintAddress)
      const yieldPositionPda = deriveYieldPositionPda(mintAddress)

      await program.methods
        .initializeYieldPosition(facilityId)
        .accounts({
          payer: wallet,
          yieldVault: yieldVaultPda,
          facilityYieldPool: facilityYieldPoolPda,
          mint: mintAddress,
          bedPosition: bedPositionPda,
          yieldPosition: yieldPositionPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['yieldPosition', vars.mintAddress.toBase58()] })
      queryClient.invalidateQueries({ queryKey: ['facilityYieldPool', vars.facilityId] })
    },
  })
}

/** 步骤 4: 管理员充值收益 */
export function useDepositYield() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      amountLamports,
      snapshotId,
    }: {
      facilityId: string
      /** lamports 字符串，如 "2000000" */
      amountLamports: string
      snapshotId: string
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const yieldVaultPda = deriveYieldVaultPda()
      const facilityYieldPoolPda = deriveFacilityYieldPoolPda(facilityId)
      const yieldDistributionPda = deriveYieldDistributionPda(snapshotId)

      await program.methods
        .depositYield(
          facilityId,
          new BN(amountLamports),
          { facilityIncome: {} },
          snapshotId,
        )
        .accounts({
          admin: wallet,
          yieldVault: yieldVaultPda,
          authority: wallet,
          facilityYieldPool: facilityYieldPoolPda,
          yieldDistributionRecord: yieldDistributionPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['facilityYieldPool', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['yieldDistribution', vars.snapshotId] })
      queryClient.invalidateQueries({ queryKey: ['yieldVault'] })
    },
  })
}

/** 步骤 5: 管理员分配收益到 NFT 仓位 */
export function useAllocateYieldToPositions() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      snapshotId,
      amountLamports,
      mintAddress,
    }: {
      facilityId: string
      snapshotId: string
      /** lamports 字符串 */
      amountLamports: string
      mintAddress: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const facilityYieldPoolPda = deriveFacilityYieldPoolPda(facilityId)
      const yieldDistributionPda = deriveYieldDistributionPda(snapshotId)
      const yieldPositionPda = deriveYieldPositionPda(mintAddress)

      await program.methods
        .allocateYieldToPositions(
          facilityId,
          snapshotId,
          new BN(amountLamports),
        )
        .accounts({
          admin: wallet,
          facilityYieldPool: facilityYieldPoolPda,
          yieldDistributionRecord: yieldDistributionPda,
          yieldPosition: yieldPositionPda,
        })
        .rpc()
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['yieldPosition', vars.mintAddress.toBase58()] })
      queryClient.invalidateQueries({ queryKey: ['facilityYieldPool', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['yieldDistribution', vars.snapshotId] })
    },
  })
}

/** 步骤 6: NFT 持有者领取收益 */
export function useClaimYield() {
  const program = useYieldVaultProgram()
  const provider = useAnchorProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      facilityId,
      mintAddress,
    }: {
      facilityId: string
      mintAddress: PublicKey
    }) => {
      if (!program || !provider)
        throw new Error('Wallet not connected')

      const wallet = provider.wallet.publicKey
      const yieldVaultPda = deriveYieldVaultPda()
      const facilityYieldPoolPda = deriveFacilityYieldPoolPda(facilityId)
      const yieldPositionPda = deriveYieldPositionPda(mintAddress)

      await program.methods
        .claimYield(mintAddress)
        .accounts({
          user: wallet,
          yieldVault: yieldVaultPda,
          facilityYieldPool: facilityYieldPoolPda,
          yieldPosition: yieldPositionPda,
        })
        .rpc()
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['yieldPosition', vars.mintAddress.toBase58()] })
      queryClient.invalidateQueries({ queryKey: ['facilityYieldPool', vars.facilityId] })
      queryClient.invalidateQueries({ queryKey: ['yieldVault'] })
    },
  })
}
