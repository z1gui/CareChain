import type { PropsWithChildren } from 'react'
import { autoDiscover, createClient } from '@solana/client'
import { SolanaProvider as SolanaClientProvider } from '@solana/react-hooks'
import { useMemo } from 'react'
import { useCluster } from '@/hooks'

export function SolanaProvider({ children }: PropsWithChildren) {
  const { cluster } = useCluster()
  const client = useMemo(() => createClient({
    ...cluster,
    walletConnectors: autoDiscover(),
  }), [cluster])

  return (
    <SolanaClientProvider client={client}>
      {children}
    </SolanaClientProvider>
  )
}
