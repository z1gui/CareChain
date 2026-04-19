import type { Dispatch, SetStateAction } from 'react'
import { useWalletConnection } from '@solana/react-hooks'
import { motion, useAnimate } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
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

interface RecommendedWallet {
  key: string
  name: string
  installUrl: string
}

const RECOMMENDED_WALLETS: RecommendedWallet[] = [
  { key: 'phantom', name: 'Phantom', installUrl: 'https://phantom.app/download' },
  { key: 'solflare', name: 'Solflare', installUrl: 'https://solflare.com/download' },
  { key: 'metamask', name: 'MetaMask', installUrl: 'https://metamask.io/download/' },
  { key: 'trust', name: 'Trust Wallet', installUrl: 'https://trustwallet.com/download' },
  { key: 'okx', name: 'OKX Wallet', installUrl: 'https://www.okx.com/web3' },
]

function matchWallet(connector: { name: string, id: string }, wallet: RecommendedWallet): boolean {
  const search = wallet.key.toLowerCase()
  return connector.name.toLowerCase().includes(search)
    || connector.id.toLowerCase().includes(search)
}

export function WalletSelectorDialog({ open, setOpen }: WalletSelectorDialogProps) {
  const { connectors, disconnect, connect, isReady, connecting } = useWalletConnection()
  const [checked, setChecked] = useState(false)
  const [scope, animate] = useAnimate()

  const availableConnectors = useMemo(
    () => connectors.filter(c => c.ready !== false && c.isSupported()),
    [connectors],
  )

  const { discoveredMap, extraConnectors } = useMemo(() => {
    const map = new Map<string, (typeof availableConnectors)[number]>()
    const matchedIds = new Set<string>()

    for (const c of availableConnectors) {
      for (const w of RECOMMENDED_WALLETS) {
        if (!map.has(w.key) && matchWallet(c, w)) {
          map.set(w.key, c)
          matchedIds.add(c.id)
          break
        }
      }
    }

    const extras = availableConnectors.filter(c => !matchedIds.has(c.id))

    return { discoveredMap: map, extraConnectors: extras }
  }, [availableConnectors])

  const walletList = useMemo(() => {
    return RECOMMENDED_WALLETS.map(w => ({
      ...w,
      connector: discoveredMap.get(w.key),
    }))
  }, [discoveredMap])

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

  const hasAnyWallet = walletList.some(w => w.connector) || extraConnectors.length > 0

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
        <div className="px-8 space-y-3 min-h-[120px] max-h-[360px] overflow-y-auto">
          {!isReady || connecting
            ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-sm text-on-surface-variant">Detecting wallets...</span>
                </div>
              )
            : !hasAnyWallet
                ? (
                    <div className="py-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-outline text-2xl">hide_source</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface mb-1">No Wallet Detected</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Install a supported wallet extension to connect.</p>
                      </div>
                    </div>
                  )
                : (
                    <>
                      {walletList.map((wallet) => {
                        const connector = wallet.connector
                        return (
                          <div
                            key={wallet.key}
                            className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-[1rem] border border-transparent transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden">
                                {connector?.icon
                                  ? (
                                      <img alt={wallet.name} className="w-full h-full object-contain" src={connector.icon} />
                                    )
                                  : (
                                      <span className="material-symbols-outlined text-outline">account_balance_wallet</span>
                                    )}
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="font-headline font-semibold text-on-surface">{wallet.name}</span>
                                {connector && (
                                  <span className="text-[10px] text-primary font-medium">Detected</span>
                                )}
                              </div>
                            </div>
                            {connector
                              ? (
                                  <button
                                    onClick={() => handleConnect(connector.id)}
                                    className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
                                  >
                                    Connect
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                                  </button>
                                )
                              : (
                                  <a
                                    href={wallet.installUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest px-3 py-1.5 rounded-lg transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    Install
                                  </a>
                                )}
                          </div>
                        )
                      })}
                      {extraConnectors.length > 0 && (
                        <div className="pt-2 border-t border-surface-container-high">
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-1">Other Wallets</p>
                          {extraConnectors.map(connector => (
                            <button
                              key={connector.id}
                              onClick={() => handleConnect(connector.id)}
                              className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-[1rem] transition-all duration-200 group border border-transparent hover:border-primary/10 mb-2"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 overflow-hidden">
                                  {connector.icon
                                    ? (
                                        <img alt={connector.name} className="w-full h-full object-contain" src={connector.icon} />
                                      )
                                    : (
                                        <span className="material-symbols-outlined text-outline">account_balance_wallet</span>
                                      )}
                                </div>
                                <span className="font-headline font-semibold text-on-surface">{connector.name}</span>
                              </div>
                              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
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
