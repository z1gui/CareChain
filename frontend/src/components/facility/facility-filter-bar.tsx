'use client'

import { Input } from '@/components/ui/input'

interface FacilityFilterBarProps {
  searchPlaceholder?: string
}

export function FacilityFilterBar({ searchPlaceholder = 'Enter name or location...' }: FacilityFilterBarProps) {
  return (
    <section className="bg-surface-container-low p-6 rounded-xl mb-12 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[240px]">
        <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">
          Search Facilities
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <Input className="pl-10" placeholder={searchPlaceholder} type="text" />
        </div>
      </div>
      <div className="w-40">
        <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">
          Region
        </label>
        <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
          <option>All Regions</option>
          <option>Foshan</option>
          <option>Guangzhou</option>
          <option>Shenzhen</option>
        </select>
      </div>
      <div className="w-44">
        <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">
          Room Type
        </label>
        <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
          <option>Standard Room</option>
          <option>Suite</option>
          <option>Memory Care</option>
        </select>
      </div>
      <div className="w-40">
        <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">
          Sort By
        </label>
        <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
          <option>Expected Yield</option>
          <option>Occupancy</option>
          <option>Newest Listing</option>
        </select>
      </div>
    </section>
  )
}
