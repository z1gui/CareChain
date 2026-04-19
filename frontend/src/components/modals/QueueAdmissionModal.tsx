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
import { Slider } from '@/components/ui/slider'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QueueAdmissionModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="bg-surface-container-low border-b border-outline-variant/10 py-6 -mx-8 -mt-8 px-8 mb-4">
          <DialogTitle className="text-xl">Admission Application Confirmation</DialogTitle>
          <DialogDescription className="text-xs font-label tracking-wide uppercase mt-0.5">
            FACILITY ID: <span className="text-primary font-bold">FSH-A301</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">analytics</span>
                <span className="text-xs font-label uppercase font-semibold">CURRENT STATUS</span>
              </div>
              <div className="text-lg font-bold text-on-surface">P3 Standard Queue</div>
              <div className="text-2xl font-headline font-extrabold text-primary">#142</div>
            </div>
            <div className="bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-label uppercase font-semibold">Estimated Wait Time</span>
              </div>
              <div className="text-lg font-bold text-on-surface">Approx. 18 months</div>
              <div className="text-sm text-error font-medium">Standard Release</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-on-surface">Acceleration Control (Burn $CARE)</label>
              <div className="text-right">
                <span className="text-2xl font-headline font-bold text-secondary">2,500</span>
                <span className="text-sm font-label text-on-surface-variant ml-1">$CARE</span>
              </div>
            </div>
            <div className="relative pt-2">
              <Slider defaultValue={[2500]} max={10000} min={0} step={100} />
              <div className="flex justify-between mt-3 text-[10px] font-bold text-outline uppercase tracking-tighter">
                <span>Standard</span>
                <span>Fast</span>
                <span>Priority</span>
                <span>Instant</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/5 rounded-xl p-6 border-l-4 border-secondary">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">ACCELERATION PREVIEW</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs text-on-surface-variant font-medium mb-1">New Rank</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-headline font-extrabold text-on-surface">#12</span>
                  <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-5xl">P2 FAST TRACK</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant font-medium mb-1">Time Saved</div>
                <div className="text-2xl font-headline font-extrabold text-tertiary">~17 Months</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
            <div>
              <div className="text-xs text-on-surface-variant font-medium mb-1">Total Burn Amount</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-headline font-extrabold text-on-surface">2,500 $CARE</span>
                <span className="text-sm text-on-surface-variant">≈ 1,240.50 USDC</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">EST. GAS: $2.40</div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="flex-1 py-4 bg-linear-to-r from-primary to-primary-container text-white rounded-5xl font-headline font-bold text-center transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
            Confirm & Apply for Admission
          </Button>
          <Button variant="ghost" onClick={onClose} className="px-8 py-4 rounded-5xl">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
