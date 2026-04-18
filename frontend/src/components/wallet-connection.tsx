'use client'

import { lamports, lamportsToSolString } from '@solana/client'
import { useBalance, useWalletConnection } from '@solana/react-hooks'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { WalletSelectorDialog } from '@/components/dialogs/wallet-selector-dialog'
import { Button } from '@/components/ui/button'
import { WalletAddress } from '@/components/wallet-address'

export default function WalletConnection() {
  const [open, setOpen] = useState(false)
  const { connected, wallet, disconnect } = useWalletConnection()
  const { lamports: balance } = useBalance(wallet?.account?.address)

  return (
    <>
      {connected
        ? (
            <div className="flex items-center gap-2">
              <Jazzicon diameter={25} seed={jsNumberForAddress(wallet?.account?.publicKey?.toString?.() ?? '')} />
              <WalletAddress address={wallet?.account?.address ?? ''} />
              <div className="text-xs text-on-surface-variant leading-relaxed select-none">{lamportsToSolString(balance ?? lamports(0))} SOL</div>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={disconnect}
              >
                <LogOut />
              </Button>
            </div>
          )
        : (
            <Button
              onClick={() => setOpen(true)}
              className="bg-primary text-white font-bold px-6 py-2 rounded-5xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap"
            >
              Connect Wallet
            </Button>
          )}
      <WalletSelectorDialog open={open} setOpen={setOpen} />
    </>
  )
}
