import { StatCard } from '@/components/shared/stat-card'

interface StatItem {
  label: string
  value: string
  description: string
}

interface StatsGridProps {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map(stat => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              borderColor="outline"
              valueClassName="text-primary"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
