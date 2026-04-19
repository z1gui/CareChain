import { cn } from '@/utils'

interface ActivityFeedItemProps {
  icon: string
  iconColor: string
  title: React.ReactNode
  subtitle?: string
  time: string
}

export function ActivityFeedItem({ icon, iconColor, title, subtitle, time }: ActivityFeedItemProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white">
      <div className="flex items-center gap-4">
        <span className={cn('material-symbols-outlined', iconColor)}>{icon}</span>
        <div>
          <p className="text-sm">{title}</p>
          {subtitle && <p className="text-[10px] text-on-surface-variant">{subtitle}</p>}
        </div>
      </div>
      <span className="text-xs text-on-surface-variant font-mono">{time}</span>
    </div>
  )
}
