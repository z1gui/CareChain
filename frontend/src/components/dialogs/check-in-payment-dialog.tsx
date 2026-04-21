'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckInPaymentDialog({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl md:rounded-5xl md:px-8">
        <DialogHeader className="text-center border-b border-outline-variant/10 pb-6">
          <div className="w-16 h-16 bg-primary-container/10 rounded-5xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>medical_information</span>
          </div>
          <DialogTitle>Check-in & Finalize Payment</DialogTitle>
          <DialogDescription>Secure your placement at the facility</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">bed</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Assigned Bed</p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">FSH-A301</h3>
                  <p className="text-sm text-on-surface-variant">Singapore RWA Center</p>
                </div>
                <div className="text-right flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-5xl text-xs font-medium bg-tertiary-container text-on-tertiary-container">
                    <span className="w-1.5 h-1.5 rounded-5xl bg-tertiary-fixed mr-2" />
                    Ready for Check-in
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-on-surface tracking-tight px-1">Payment Summary</h4>
            <div className="bg-surface-container-low rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Entrance Fee</span>
                <span className="font-semibold text-on-surface">2,500 USDC</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-outline-variant/20">
                <span className="font-bold text-on-surface">Total Due</span>
                <div className="text-right">
                  <span className="block text-xl font-extrabold text-primary font-headline">2,500 USDC</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Approx. 22.45 SOL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary-fixed/30 rounded-xl p-4 flex gap-3 items-start border border-secondary-container/10">
            <span className="material-symbols-outlined text-secondary text-xl mt-0.5">account_balance_wallet</span>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Notice: This payment is being transferred to the <span className="font-bold text-secondary">BedRight NFT owner</span> via smart contract for immediate occupancy rights. Verification will be processed on Solana.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <Button onClick={onClose} className="w-full py-4 bg-linear-to-r from-primary to-primary-container text-on-primary rounded-5xl font-bold text-sm tracking-tight shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Confirm & Transfer Payment
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full py-3">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
