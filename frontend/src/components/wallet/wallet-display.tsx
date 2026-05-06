import { lamports, lamportsToSolString } from '@solana/client'
import { useBalance, useWalletConnection } from '@solana/react-hooks'
import { UnplugIcon } from 'lucide-react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WalletAddress } from '@/components/wallet/wallet-address'

export function WalletDisplay() {
  const { wallet, disconnect } = useWalletConnection()
  const { lamports: balance } = useBalance(wallet?.account?.address)

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton={true}
          render={(
            <Button className="rounded-full px-1.5">
              <Jazzicon diameter={25} seed={jsNumberForAddress(wallet?.account?.publicKey?.toString?.() ?? '')} />
              <WalletAddress className="text-background border-none px-1" address={wallet?.account?.address ?? ''} />
            </Button>
          )}
        />
        <DropdownMenuContent
          align="start"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="px-1 py-1.5 text-left">
                <div className="text-[16px] text-on-surface-variant leading-relaxed select-none font-bold">
                  {lamportsToSolString(balance ?? lamports(0))} SOL
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={disconnect} role="button">
              <UnplugIcon /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
