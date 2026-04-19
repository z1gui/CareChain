'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface FacilityCardProps {
  name: string
  location: string
  yield: string
  occupancy: number
  totalBeds: number
  queueCount: number
  queueBoost: string
  image: string
  badges?: Array<{ label: string, variant: React.ComponentProps<typeof Badge>['variant'] }>
  onBuyClick?: () => void
  detailHref: string
}

export function FacilityCard({
  name,
  location,
  yield: yieldValue,
  occupancy,
  totalBeds,
  queueCount,
  queueBoost,
  image,
  badges = [],
  onBuyClick,
  detailHref,
}: FacilityCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-primary/10">
      <div className="h-56 relative overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={name}
          src={image}
        />
        {badges.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            {badges.map(badge => (
              <Badge key={badge.label} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-on-surface font-headline">{name}</h3>
            <div className="flex items-center text-on-surface-variant text-sm mt-1">
              <span className="material-symbols-outlined text-sm mr-1">location_on</span>
              {location}
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-tertiary font-headline">{yieldValue}</span>
            <div className="text-[10px] text-outline font-bold uppercase">Expected Yield</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface-container-low p-3 rounded-lg">
            <div className="text-xs text-outline mb-1">Occupancy</div>
            <div className="text-sm font-bold text-on-surface">{occupancy}%</div>
            <div className="h-1 bg-surface-container-highest mt-2 rounded-5xl overflow-hidden">
              <div className="h-full bg-tertiary" style={{ width: `${occupancy}%` }} />
            </div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-lg">
            <div className="text-xs text-outline mb-1">Total Beds</div>
            <div className="text-sm font-bold text-on-surface">{totalBeds}</div>
          </div>
          <div className="bg-secondary-fixed p-3 rounded-lg">
            <div className="text-xs text-on-secondary-fixed-variant mb-1">P3 Queue</div>
            <div className="text-sm font-bold text-on-secondary-fixed">{queueCount} People</div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>speed</span>
            <span className="text-xs font-medium">Queue Boost: <span className="font-bold">{queueBoost}</span></span>
          </div>
          <span className="material-symbols-outlined text-outline text-sm">info</span>
        </div>
        <div className="flex gap-3">
          <Link
            href={detailHref}
            className="flex-1 py-3 bg-surface-container-high text-on-surface text-center font-bold rounded-lg hover:bg-surface-dim transition-colors"
          >
            Details
          </Link>
          <button
            onClick={onBuyClick}
            className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity active:scale-95"
          >
            Buy NFT
          </button>
        </div>
      </div>
    </div>
  )
}
