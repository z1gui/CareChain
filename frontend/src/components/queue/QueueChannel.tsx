'use client'

import { cn } from '@/utils'

interface QueueItemData {
  rank: number
  name: string
  detail: string
  status: string
}

interface QueueChannelProps {
  title: string
  subtitle: string
  icon: string
  iconColor: string
  headerGradient: string
  badge: string
  badgeColor: string
  items: QueueItemData[]
  viewAllText: string
  onViewAll?: () => void
}

export function QueueChannel({
  title,
  subtitle,
  icon,
  iconColor,
  headerGradient,
  badge,
  badgeColor,
  items,
  viewAllText,
  onViewAll,
}: QueueChannelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={cn('material-symbols-outlined', iconColor)} style={{ fontVariationSettings: '"FILL" 1' }}>
            {icon}
          </span>
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        <span className={cn('text-xs font-bold px-3 py-1 rounded-5xl', badgeColor)}>
          {badge}
        </span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className={cn('p-4 flex items-center justify-between', headerGradient)}>
          <span className="text-white text-xs font-bold">Priority Level: {subtitle}</span>
        </div>
        <div className="divide-y divide-slate-50">
          {items.map(item => (
            <div key={item.rank} className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
              <div className={cn(
                'w-10 h-10 rounded-5xl flex items-center justify-center font-bold',
                item.rank === 1 ? 'bg-gradient-to-br from-amber-100 to-amber-300 text-amber-800' : 'bg-slate-100 text-slate-400',
              )}
              >
                {item.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-[10px] text-on-surface-variant">{item.detail}</p>
              </div>
              <span className="text-xs font-medium text-primary">{item.status}</span>
            </div>
          ))}
        </div>
        <button onClick={onViewAll} className="w-full py-4 text-xs font-bold text-primary hover:bg-slate-50 transition-all border-t border-slate-100">
          {viewAllText}
        </button>
      </div>
    </div>
  )
}
