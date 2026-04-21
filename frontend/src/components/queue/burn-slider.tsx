'use client'

import { Slider } from '@/components/ui/slider'

interface BurnSliderProps {
  amount: number
  onChange?: (value: number[]) => void
  estimatedJump: string
  timeSaved: string
  onConfirm?: () => void
  onRules?: () => void
}

export function BurnSlider({
  amount,
  onChange,
  estimatedJump,
  timeSaved,
  onConfirm,
  onRules,
}: BurnSliderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-5xl bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white">speed</span>
        </div>
        <div>
          <h3 className="text-xl font-bold font-headline">Improve Ranking Slider</h3>
          <p className="text-sm text-on-surface-variant">Burn $CARE tokens to exchange for faster bed allocation</p>
        </div>
      </div>
      <div className="bg-surface-container-low p-6 rounded-2xl">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Burn Amount</span>
          <div className="text-right">
            <span className="text-3xl font-bold font-headline text-secondary">{amount.toLocaleString()}</span>
            <span className="text-sm text-secondary ml-1">$CARE</span>
          </div>
        </div>
        <Slider defaultValue={[amount]} max={50000} min={100} step={100} onValueChange={value => onChange?.(Array.isArray(value) ? [...value] : [value])} />
        <div className="flex justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant">Estimated Jump</span>
            <span className="text-lg font-bold text-tertiary">{estimatedJump}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-on-surface-variant">Time Saved</span>
            <span className="text-lg font-bold text-tertiary">{timeSaved}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={onConfirm} className="flex-1 bg-secondary text-white py-4 rounded-5xl font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Confirm Burn & Boost
        </button>
        <button onClick={onRules} className="px-6 border border-slate-200 rounded-5xl text-slate-600 font-medium hover:bg-slate-50">
          Rules
        </button>
      </div>
    </div>
  )
}
