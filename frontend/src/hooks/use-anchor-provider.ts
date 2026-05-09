import { useMemo } from 'react'
import { AnchorProvider, type Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey, type Transaction, type VersionedTransaction } from '@solana/web3.js'
import { useWalletConnection } from '@solana/react-hooks'
import { useCluster } from './use-cluster'

function adaptWallet(walletSession: any): Wallet {
  return {
    publicKey: new PublicKey(walletSession.account.address),
    signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
      const feature = walletSession.features?.['solana:signTransaction']
      if (feature) {
        const [result] = await feature.signTransaction({ transaction: tx })
        return result.signedTransaction as T
      }
      if (walletSession.signTransaction) {
        return walletSession.signTransaction(tx)
      }
      throw new Error('Wallet does not support transaction signing')
    },
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
      const feature = walletSession.features?.['solana:signTransaction']
      if (feature) {
        const inputs = txs.map(tx => ({ transaction: tx }))
        const results = await feature.signTransaction(...inputs)
        return results.map((r: any) => r.signedTransaction)
      }
      if (walletSession.signAllTransactions) {
        return walletSession.signAllTransactions(txs)
      }
      return Promise.all(txs.map(tx => adaptWallet(walletSession).signTransaction(tx)))
    },
  } as unknown as Wallet
}

export function useAnchorProvider() {
  const { cluster } = useCluster()
  const { wallet } = useWalletConnection()

  return useMemo(() => {
    if (!wallet?.account?.address)
      return null

    const connection = new Connection(cluster.endpoint, 'confirmed')
    const anchorWallet = adaptWallet(wallet)

    return new AnchorProvider(connection, anchorWallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    })
  }, [cluster.endpoint, wallet])
}
