'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AssetManagementDialog({ isOpen, onClose }: ModalProps) {
  const [mode, setMode] = useState<'yield' | 'stay'>('yield')

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-primary">BedRight NFT Management</DialogTitle>
          <DialogDescription>Asset Serial: FSH-A301</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Asset Summary Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Location</span>
              </div>
              <p className="text-lg font-headline font-bold text-on-surface">Farrer Park, Singapore</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">bed</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Asset Type</span>
              </div>
              <p className="text-lg font-headline font-bold text-on-surface">Premium ICU Bed</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between p-6 bg-linear-to-br from-primary to-primary-container rounded-xl text-white shadow-lg shadow-primary/10">
            <div>
              <p className="text-primary-fixed text-sm font-medium mb-1 opacity-90">Current APR</p>
              <p className="text-4xl font-headline font-extrabold">12.45%</p>
            </div>
            <div className="text-right">
              <p className="text-primary-fixed text-sm font-medium mb-1 opacity-90">Accrued USDC</p>
              <p className="text-3xl font-headline font-bold">$4,821.50</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">sync_alt</span>
                Operation Mode
              </label>
              <div className="flex bg-surface-container-high p-1 rounded-5xl w-fit">
                <button
                  onClick={() => setMode('yield')}
                  className={`px-6 py-2 rounded-5xl text-sm font-bold transition-all ${
                    mode === 'yield'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Yield
                </button>
                <button
                  onClick={() => setMode('stay')}
                  className={`px-6 py-2 rounded-5xl text-sm font-bold transition-all ${
                    mode === 'stay'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Stay
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-tertiary-container/10 rounded-xl border border-tertiary/10">
              <span className="material-symbols-outlined text-tertiary text-xl mt-0.5">info</span>
              <div className="text-xs leading-relaxed text-on-tertiary-fixed-variant">
                <strong>Cooling Period Info:</strong> After a mode change, a 30-day cooling period will be applied. You cannot change the status again during this time. In Yield mode, your asset is automatically added to the CareChain pool to earn steady returns.
              </div>
            </div>
          </div>

          {/* Transfer Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">send</span>
              NFT Asset Transfer
            </h3>
            <div className="flex gap-2">
              <div className="relative grow">
                <Input className="py-5" placeholder="Recipient wallet address (0x...)" type="text" />
              </div>
              <Button className="bg-secondary text-on-secondary px-6 py-5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
                Transfer Asset
              </Button>
            </div>
            <p className="text-[11px] text-outline text-center">
              Transfer operations are irreversible. Please verify the recipient address carefully.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Confirm & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
