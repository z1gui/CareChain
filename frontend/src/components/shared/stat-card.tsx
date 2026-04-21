'use client'

import { cn } from '@/utils'

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  className?: string
  valueClassName?: string
  borderColor?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  progress?: number
  progressColor?: string
  children?: React.ReactNode
}

export function StatCard({
  label,
  value,
  description,
  className,
  valueClassName,
  borderColor = 'primary',
  progress,
  progressColor = 'bg-tertiary',
  children,
}: StatCardProps) {
  const borderColors = {
    primary: 'border-l-4 border-primary',
    secondary: 'border-l-4 border-secondary',
    tertiary: 'border-l-4 border-tertiary',
    outline: 'border border-outline-variant/10',
  }

  return (
    <div
      className={cn(
        'bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between',
        borderColors[borderColor],
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-label font-bold text-outline uppercase tracking-wider">
          {label}
        </span>
        {children}
      </div>
      <div className="mt-4">
        <div className={cn('text-3xl font-headline font-extrabold text-on-surface', valueClassName)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-on-surface-variant mt-1">{description}</p>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-4 w-full h-1.5 bg-surface-container rounded-5xl overflow-hidden">
          <div
            className={cn('h-full rounded-5xl', progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
