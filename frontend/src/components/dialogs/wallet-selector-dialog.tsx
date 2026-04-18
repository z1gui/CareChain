import type { Dispatch, SetStateAction } from 'react'
import { useWalletConnection } from '@solana/react-hooks'
import { motion, useAnimate } from 'motion/react'
import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface WalletSelectorDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function WalletSelectorDialog({ open, setOpen }: WalletSelectorDialogProps) {
  const { connectors, disconnect, connect } = useWalletConnection()
  const [checked, setChecked] = useState(false)
  const [scope, animate] = useAnimate()

  const handleConnect = async (connectorId: string) => {
    if (!checked) {
      animate(scope.current, {
        x: [0, -8, 8, -8, 8, 0],
        transition: {
          duration: 0.1,
          ease: 'easeInOut',
        },
      })
      return
    }

    try {
      await connect(connectorId, {
        autoConnect: false,
      })
      setOpen(false)
    }
    catch {
      await disconnect()
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setChecked(false)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-[1rem] mb-4 bg-primary-container/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
          </div>
          <DialogTitle>
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to CareChain
          </DialogDescription>
        </DialogHeader>
        <div className="px-8 space-y-3">
          {
            connectors.map((connector) => {
              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-[1rem] transition-all duration-200 group border border-transparent hover:border-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                      <img alt={connector.name} className="w-full h-full object-contain" src={connector.icon} />
                    </div>
                    <span className="font-headline font-semibold text-on-surface">{connector.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                </button>
              )
            })
          }
        </div>
        <DialogFooter>
          <motion.div
            className="flex items-start gap-3 cursor-pointer group"
            ref={scope}
          >
            <Checkbox checked={checked} onCheckedChange={setChecked} id="terms" className="size-5" />
            <Label htmlFor="terms">
              <span className="font-body text-xs text-on-surface-variant leading-relaxed select-none">
                I have read and agree to the <a className="text-primary hover:underline font-semibold" href="#">Terms & Conditions</a> and <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>. By connecting your wallet, you acknowledge asset ownership verification by CareChain.
              </span>
            </Label>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
