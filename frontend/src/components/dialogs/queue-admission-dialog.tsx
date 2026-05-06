'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QueueAdmissionDialog({ isOpen, onClose }: ModalProps) {
  const [burnAmount, setBurnAmount] = useState(2500)

  const newRank = useMemo(() => {
    if (burnAmount <= 0)
      return 142
    const rank = Math.max(1, Math.round(142 - (burnAmount / 10000) * 140))
    return rank
  }, [burnAmount])

  const timeSaved = useMemo(() => {
    if (burnAmount <= 0)
      return '0 Months'
    const months = Math.round((burnAmount / 10000) * 17)
    return months > 0 ? `~${months} Months` : '~1 Month'
  }, [burnAmount])

  const trackLabel = useMemo(() => {
    if (burnAmount < 2500)
      return 'P3 STANDARD QUEUE'
    if (burnAmount < 5000)
      return 'P2 FAST TRACK'
    if (burnAmount < 7500)
      return 'P1 PRIORITY'
    return 'P0 INSTANT'
  }, [burnAmount])

  const usdcValue = useMemo(() => {
    return (burnAmount * 0.4962).toFixed(2)
  }, [burnAmount])

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-surface-container-low">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-base font-semibold text-on-surface">Admission Application Confirmation</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                FACILITY ID:
                {' '}
                <span className="text-primary font-bold">FSH-A301</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-[10px] text-on-surface-variant">analytics</span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">CURRENT STATUS</span>
              </div>
              <div className="text-sm font-bold text-on-surface">P3 Standard Queue</div>
              <div className="text-xl font-headline font-extrabold text-primary">#142</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-[10px] text-on-surface-variant">schedule</span>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">ESTIMATED WAIT TIME</span>
              </div>
              <div className="text-sm font-bold text-on-surface">Approx. 18 months</div>
              <div className="text-xs text-error font-bold">Standard Release</div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-on-surface">Acceleration Control (Burn $CARE)</label>
              <div className="text-right">
                <span className="text-lg font-headline font-bold text-secondary">{burnAmount.toLocaleString()}</span>
                <span className="text-xs font-bold text-on-surface-variant ml-1">$CARE</span>
              </div>
            </div>
            <div className="relative">
              <Slider defaultValue={[burnAmount]} max={10000} min={0} step={100} onValueChange={v => setBurnAmount(Array.isArray(v) ? v[0] : v)} />
              <div className="flex justify-between mt-2 text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">
                <span>STANDARD</span>
                <span>FAST</span>
                <span>PRIORITY</span>
                <span>INSTANT</span>
              </div>
            </div>
          </div>

          {/* Acceleration Preview */}
          <div className="bg-secondary/5 rounded-xl p-5 border-l-[3px] border-secondary relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">ACCELERATION PREVIEW</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] text-on-surface-variant font-medium mb-1">New Rank</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-headline font-extrabold text-on-surface">#{newRank}</span>
                  <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[9px] font-bold rounded-full">{trackLabel}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-on-surface-variant font-medium mb-1">Time Saved</div>
                <div className="text-xl font-headline font-extrabold text-tertiary">{timeSaved}</div>
              </div>
            </div>
          </div>

          {/* Total Burn */}
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-5">
            <div>
              <div className="text-[10px] text-on-surface-variant font-medium mb-0.5">Total Burn Amount</div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-headline font-extrabold text-on-surface">{burnAmount.toLocaleString()} $CARE</span>
                <span className="text-xs text-on-surface-variant">≈ {usdcValue} USDC</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">EST. GAS: $2.40</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-surface-container-low flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Confirm & Apply for Admission
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6 py-4 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
