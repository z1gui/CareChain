'use client'

import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ClusterProvider } from '@/components/providers/cluster-provider'
import { SolanaProvider } from '@/components/providers/solana-provider'

const queryClient = new QueryClient()

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </SolanaProvider>
    </ClusterProvider>
  )
}
