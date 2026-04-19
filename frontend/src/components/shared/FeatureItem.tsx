import { cn } from '@/utils'

interface FeatureItemProps {
  icon: string
  title: string
  description: string
  iconBgColor?: string
  iconTextColor?: string
}

export function FeatureItem({
  icon,
  title,
  description,
  iconBgColor = 'bg-primary-container',
  iconTextColor = 'text-on-primary-container',
}: FeatureItemProps) {
  return (
    <div className="flex gap-6">
      <div
        className={cn(
          'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          iconBgColor,
        )}
      >
        <span className={cn('material-symbols-outlined', iconTextColor)}>{icon}</span>
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
