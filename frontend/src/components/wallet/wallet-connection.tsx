'use client'

import { useWalletConnection } from '@solana/react-hooks'
import { useState } from 'react'
import { WalletSelectorDialog } from '@/components/dialogs/wallet-selector-dialog'
import { WalletClusterSelector } from '@/components/wallet/wallet-cluster-selector'
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button'
import { WalletDisplay } from '@/components/wallet/wallet-display'

export function WalletConnection() {
  const [open, setOpen] = useState(false)
  const { connected } = useWalletConnection()

  return (
    <>
      {connected
        ? (
            <div className="flex items-center gap-x-1.5">
              <WalletClusterSelector />
              <WalletDisplay />
            </div>
          )
        : (
            <WalletConnectButton onClick={() => setOpen(true)} />
          )}
      <WalletSelectorDialog open={open} setOpen={setOpen} />
    </>
  )
}
