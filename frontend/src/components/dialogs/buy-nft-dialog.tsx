'use client'

import { useState } from 'react'
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

const assetTypes = [
  {
    id: 'standard',
    icon: 'bedroom_child',
    name: 'Standard Care Unit',
    desc: 'Core Asset · Stable Occupancy',
    price: '500 USDC',
    priceNum: 500,
    apy: '7.2%',
    apyNum: 7.2,
    recommended: false,
  },
  {
    id: 'garden',
    icon: 'spa',
    name: 'Garden Suite',
    desc: 'High-Net-Worth · Premium Service',
    price: '1,200 USDC',
    priceNum: 1200,
    apy: '8.5%',
    apyNum: 8.5,
    recommended: true,
  },
  {
    id: 'memory',
    icon: 'psychology',
    name: 'Memory Care',
    desc: 'Rare License · High Entry Barrier',
    price: '2,500 USDC',
    priceNum: 2500,
    apy: '11.2%',
    apyNum: 11.2,
    recommended: false,
  },
]

export function BuyNftDialog({ isOpen, onClose }: ModalProps) {
  const [selected, setSelected] = useState('garden')

  const selectedAsset = assetTypes.find(a => a.id === selected)!
  const annualYield = ((selectedAsset.priceNum * selectedAsset.apyNum) / 100).toFixed(2)

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="w-[80vw] max-w-4xl p-6 gap-0">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-primary text-xl font-headline font-bold">Buy BedRight NFT</DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant mt-1">
            Please select the asset type you wish to invest in
          </DialogDescription>
        </DialogHeader>

        {/* Asset Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {assetTypes.map(asset => {
            const isSelected = selected === asset.id
            return (
              <div
                key={asset.id}
                onClick={() => setSelected(asset.id)}
                className={[
                  'relative rounded-xl p-4 cursor-pointer transition-all duration-200 border-2',
                  isSelected
                    ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/10'
                    : 'bg-surface-container-low border-transparent hover:-translate-y-0.5',
                ].join(' ')}
              >
                {asset.recommended && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-2.5 py-0.5 rounded-5xl text-[9px] font-bold uppercase tracking-widest whitespace-nowrap shadow">
                    Recommended
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <div className={[
                    'p-1.5 rounded-lg',
                    isSelected ? 'bg-primary/10' : 'bg-surface-container-highest',
                  ].join(' ')}>
                    <span className="material-symbols-outlined text-primary text-[20px]">{asset.icon}</span>
                  </div>
                  <div className={[
                    'w-4 h-4 rounded-5xl border-2 flex items-center justify-center flex-shrink-0',
                    isSelected ? 'border-primary' : 'border-outline',
                  ].join(' ')}>
                    {isSelected && <div className="w-2 h-2 bg-primary rounded-5xl" />}
                  </div>
                </div>

                <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mb-0.5">{asset.name}</h3>
                <p className="text-[11px] text-on-surface-variant mb-3 leading-snug">{asset.desc}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">Price</span>
                    <span className="font-headline font-bold text-primary text-sm">{asset.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                    <span className="px-1.5 py-0.5 bg-tertiary/10 text-tertiary rounded text-xs font-bold">{asset.apy}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary + CTA */}
        <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5">Est. Annual Yield</p>
              <p className="font-headline text-2xl font-extrabold text-tertiary tracking-tight leading-none">
                {annualYield} <span className="text-sm font-bold">USDC</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5">Total Payment</p>
              <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight leading-none">
                {selectedAsset.priceNum.toLocaleString()}.00 <span className="text-sm font-bold text-on-surface-variant">USDC</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 px-5 py-2.5 bg-primary text-white font-headline font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
            Confirm Purchase
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 justify-center mt-4 text-outline">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <p className="text-[11px] font-medium">All assets are regulated by Sovereign Sanctuary and audited by third parties</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
