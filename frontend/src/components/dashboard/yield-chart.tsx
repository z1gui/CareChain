'use client'

interface ChartBar {
  label: string
  height: string
  isActive?: boolean
}

interface YieldChartProps {
  bars: ChartBar[]
}

export function YieldChart({ bars }: YieldChartProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm h-72 flex flex-col relative overflow-hidden">
      <div className="flex-grow flex items-end justify-between gap-2 pt-10">
        <div className="w-full flex items-end justify-around h-full px-2 relative z-10">
          {bars.map(bar => (
            <div key={bar.label} className="group relative flex flex-col items-center w-12">
              <div
                className={
                  bar.isActive
                    ? 'w-full bg-primary-container rounded-t-lg shadow-[0_-8px_20px_rgba(0,131,120,0.2)]'
                    : 'w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all'
                }
                style={{ height: bar.height }}
              />
              <span
                className={
                  bar.isActive
                    ? 'text-[10px] mt-2 font-label text-primary font-bold uppercase'
                    : 'text-[10px] mt-2 font-label text-outline uppercase'
                }
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 grid grid-rows-4 pointer-events-none p-6 py-10 opacity-10">
        <div className="border-b border-on-surface" />
        <div className="border-b border-on-surface" />
        <div className="border-b border-on-surface" />
        <div className="border-b border-on-surface" />
      </div>
    </div>
  )
}
