'use client'

import { cn } from '@/utils'

interface NftCardProps {
  serial: string
  location: string
  yield: string
  buyPrice: string
  image: string
  type: 'Standard Bed' | 'Luxury Suite' | string
  mode: 'Yield Mode' | 'Occupancy Mode' | string
  queue?: string
  onManage?: () => void
}

export function NftCard({
  serial,
  location,
  yield: yieldValue,
  buyPrice,
  image,
  type,
  mode,
  queue,
  onManage,
}: NftCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-outline-variant/10">
      <div className="h-48 relative overflow-hidden">
        <img
          alt={serial}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={image}
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-5xl text-[10px] font-bold text-white uppercase">
          {type}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className={cn(
            'px-2 py-1 rounded text-[10px] font-bold',
            mode === 'Yield Mode' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary text-white',
          )}
          >
            {mode}
          </span>
          {queue && (
            <span className="px-2 py-1 bg-white/90 text-on-surface rounded text-[10px] font-bold">
              {queue}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-bold font-headline">{serial}</h4>
          <div className="text-right">
            <div className="text-xs font-label uppercase text-outline">APY</div>
            <div className="text-lg font-black text-tertiary">{yieldValue}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm py-3 border-y border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-xs text-outline">Location</span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-outline">Buy Price</span>
            <span className="font-medium">{buyPrice}</span>
          </div>
        </div>
        <button
          onClick={onManage}
          className="w-full py-2.5 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
        >
          Manage Asset
        </button>
      </div>
    </div>
  )
}
