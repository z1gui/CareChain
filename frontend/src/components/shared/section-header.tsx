import { cn } from '@/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  badge?: string
  className?: string
  action?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  badge,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row justify-between items-end mb-6', className)}>
      <div>
        {badge && (
          <span className="text-xs font-label font-bold text-primary uppercase tracking-[0.2em] mb-2 block">
            {badge}
          </span>
        )}
        <h1 className={cn(
          'text-[32px] font-headline font-bold text-[#0D4741] leading-tight',
          !badge && 'mb-2',
        )}
        >
          {title}
        </h1>
        {description && (
          <p className="text-on-surface-variant max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  )
}
