'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BuyNftDialog({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Buy BedRight NFT</DialogTitle>
          <DialogDescription>Please select the asset type you wish to invest in</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-surface-container-low p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-transparent">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-surface-container-highest p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">bedroom_child</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Standard Care Unit</h3>
              <p className="text-sm text-on-surface-variant mb-6">Core Asset · Stable Occupancy</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">500 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">7.2%</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-surface-container-lowest p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-primary ring-4 ring-primary/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-3 py-1 rounded-5xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Recommended
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">spa</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Garden Suite</h3>
              <p className="text-sm text-on-surface-variant mb-6">High-Net-Worth · Premium Service</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">1,200 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">8.5%</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-surface-container-low p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-transparent">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-surface-container-highest p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Memory Care</h3>
              <p className="text-sm text-on-surface-variant mb-6">Rare License · High Entry Barrier</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">2,500 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">11.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high/50 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-12 w-full md:w-auto justify-between md:justify-start">
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Est. Annual Yield</p>
                <p className="font-headline text-3xl font-extrabold text-tertiary tracking-tight">102.00 <span className="text-lg font-bold">USDC</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Total Payment</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">1,200.00</p>
                  <p className="font-bold text-on-surface-variant">USDC</p>
                </div>
              </div>
            </div>
            <Button onClick={onClose} className="w-full md:w-auto px-10 py-4 bg-linear-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-5xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
              <span>Confirm Purchase</span>
            </Button>
          </div>

          <div className="flex items-center gap-3 justify-center text-outline">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <p className="text-xs font-medium">All assets are regulated by Sovereign Sanctuary and audited by third parties</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
