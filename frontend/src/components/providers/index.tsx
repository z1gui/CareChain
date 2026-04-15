'use client'

import type { PropsWithChildren } from 'react'
import { autoDiscover, createClient } from '@solana/client'
import { SolanaProvider } from '@solana/react-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient()

const client = createClient({
  cluster: 'devnet',
  walletConnectors: autoDiscover(),
})

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SolanaProvider client={client}>
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
  )
}
