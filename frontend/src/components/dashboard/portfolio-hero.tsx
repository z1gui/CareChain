interface PortfolioStat {
  label: string
  value: string
  unit: string
  highlight?: boolean
}

interface PortfolioHeroProps {
  totalValue: string
  unit: string
  stats: PortfolioStat[]
  onCompound?: () => void
  onAddAssets?: () => void
}

export function PortfolioHero({
  totalValue,
  unit,
  stats,
  onCompound,
  onAddAssets,
}: PortfolioHeroProps) {
  return (
    <div className="lg:col-span-8 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl shadow-xl text-on-primary flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-5xl blur-3xl group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute right-20 bottom-10 w-32 h-32 bg-secondary/20 rounded-5xl blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
          <span className="text-xs font-label uppercase tracking-widest font-semibold">Portfolio Value</span>
        </div>
        <div className="text-5xl font-headline font-black mb-8 tracking-tight">
          {totalValue} <span className="text-2xl font-medium opacity-70">{unit}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="space-y-1 border-l border-white/20 pl-4">
              <span className="text-xs font-label uppercase opacity-80 block">{stat.label}</span>
              <div className={stat.highlight ? 'text-xl font-bold font-headline text-tertiary-fixed' : 'text-xl font-bold font-headline'}>
                {stat.value} <span className={stat.highlight ? 'text-sm opacity-80 font-normal' : 'text-sm opacity-80'}>{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-4 relative z-10">
        <button
          onClick={onCompound}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold px-6 py-3 rounded-5xl transition-all text-sm"
        >
          Compound
        </button>
        <button
          onClick={onAddAssets}
          className="bg-secondary text-white font-bold px-6 py-3 rounded-5xl shadow-lg hover:scale-105 transition-all text-sm"
        >
          Add Assets
        </button>
      </div>
    </div>
  )
}
