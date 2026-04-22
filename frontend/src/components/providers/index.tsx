'use client'

import type { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { ClusterProvider } from '@/components/providers/cluster-provider'
import { SolanaProvider } from '@/components/providers/solana-provider'
import { TanstackProvider } from '@/components/providers/tanstack-provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TanstackProvider>
      </SolanaProvider>
    </ClusterProvider>
  )
}
