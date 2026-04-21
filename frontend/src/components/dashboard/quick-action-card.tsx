import Link from 'next/link'
import { cn } from '@/utils'

interface QuickActionCardProps {
  href?: string
  onClick?: () => void
  icon: string
  title: string
  description: string
  color: 'primary' | 'secondary' | 'tertiary'
}

export function QuickActionCard({
  href,
  onClick,
  icon,
  title,
  description,
  color,
}: QuickActionCardProps) {
  const colors = {
    primary: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
    secondary: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white',
    tertiary: 'bg-tertiary/10 text-tertiary group-hover:bg-tertiary group-hover:text-white',
  }

  const Wrapper = href ? Link : 'button'
  const wrapperProps = href
    ? { href, className: 'block w-full text-left' }
    : { onClick, className: 'block w-full text-left' }

  return (
    <Wrapper {...wrapperProps as any}>
      <div className="w-full p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-all', colors[color])}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <div className="font-bold text-on-surface">{title}</div>
          <div className="text-xs text-on-surface-variant">{description}</div>
        </div>
      </div>
    </Wrapper>
  )
}
