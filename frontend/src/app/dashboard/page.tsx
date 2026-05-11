'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWalletConnection } from '@solana/react-hooks'
import { getPortfolioSummaryQuery, getPortfolioYieldTrendQuery } from '@/apis/portfolio/queries'
import { PortfolioHero } from '@/components/dashboard/portfolio-hero'
import { QuickActionCard } from '@/components/dashboard/quick-action-card'
import { YieldChart } from '@/components/dashboard/yield-chart'
import { QueueAdmissionDialog } from '@/components/dialogs'
import { NftCard } from '@/components/facility/nft-card'
import { SectionHeader } from '@/components/shared/section-header'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'

const quickActions = [
  { href: '/facilities', icon: 'explore', title: 'Explore Facilities', description: 'Discover new RWA healthcare real estate units', color: 'primary' as const },
  { href: '/buy-care', icon: 'payments', title: 'Buy $CARE', description: 'Access the priority queue system', color: 'secondary' as const },
  { icon: 'history_edu', title: 'Governance Voting', description: 'Propose or vote on asset protocols', color: 'tertiary' as const },
]

const nftAssets = [
  {
    serial: 'FSH-A301',
    location: 'SF Health Center',
    yield: '7.2%',
    buyPrice: '45.00 SOL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjnYydeQhaROgqoMGVzeSvZYy9rsGfI5eP9zPccTFXBoioAu28WUG9upkGonMLGSVWzNIE0MleVnO5rqjlWmR5lod4QHh7nA9seljCz0y4T8tMLYU7Bdxqsb0pnMV9vGn4FMlYT07f1hAl-rmeQi6OBebXiP0nkKd0rVdtSPdifxTZpufLI5L5Qt27pE50wFFvDAeGXWCDuZWRMwQqLIpjJm_b6IjMk9olqhTIi9C9cW0HBhuv1HTKpoAGBujqSha20Egs-2gnFwIe',
    type: 'Standard Bed',
    mode: 'Yield Mode',
    mintAddress: undefined,
  },
  {
    serial: 'FSH-B102',
    location: 'Boston Nursing Hub',
    yield: '7.8%',
    buyPrice: '80.00 SOL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE3N0Ug83WlqbU5bro2oHKRgIzDN88oPB0-w1ywYMHdOOMP4O8muP2ACbXD3X8PMTGjX4FqB0Jh0mU1AJOVSt-61GMDMyNOioqgg_ztQPUNdAMkMwywORsyQVbDMyfF5xRw8MAdjjrLVnnCqZMMFJDj6k-DuiTEL8x9GN5RH3FUe2G3ivOEY5FydNmwYy7At6RzDBqYJ8WUHJaFraaWmy3TcQyHvgWGk6ltcHLor_WxWnmMMXmKhhoVKW7qJAbYFLG-ysioSUPOYeL',
    type: 'Luxury Suite',
    mode: 'Occupancy Mode',
    queue: 'P1 Queue',
    mintAddress: undefined,
  },
]

function formatSol(value: number, digits = 2) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function toChartBars(points: Array<{ label: string, yieldSol: number }>) {
  if (points.length === 0) return []

  const maxYield = Math.max(...points.map(point => point.yieldSol), 1)

  return points.map((point, index) => ({
    label: point.label,
    height: `${Math.max(20, Math.round((point.yieldSol / maxYield) * 100))}%`,
    isActive: index === points.length - 1,
  }))
}

export default function DashboardPage() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)
  const { wallet } = useWalletConnection()
  const walletAddress = wallet?.account?.address ?? ''

  const summaryQuery = useQuery({
    ...getPortfolioSummaryQuery(walletAddress),
    enabled: Boolean(walletAddress),
  })
  const trendQuery = useQuery({
    ...getPortfolioYieldTrendQuery(walletAddress, '6m'),
    enabled: Boolean(walletAddress),
  })

  const summary = summaryQuery.data?.data
  const trend = trendQuery.data?.data
  const chartBars = trend ? toChartBars(trend.points) : []

  const portfolioStats = [
    {
      label: 'Monthly Yield',
      value: summary ? formatSol(summary.monthlyYieldSol) : '--',
      unit: 'SOL',
      highlight: false,
    },
    {
      label: 'Accrued Yield',
      value: summary ? formatSol(summary.accruedYieldSol, 3) : '--',
      unit: 'SOL',
      highlight: false,
    },
    {
      label: 'Annual Yield',
      value: summary ? `${summary.annualApy.toFixed(1)}%` : '--',
      unit: 'APY',
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-surface">
      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-10">
        <section>
          <SectionHeader
            title="Portfolio Details"
            badge="Sovereign Sanctuary"
            action={(
              <Button
                variant="outline"
                className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-bold px-4 py-2 rounded-5xl text-sm flex items-center gap-2 hover:bg-white shadow-sm transition-all h-auto"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export Statement
              </Button>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <PortfolioHero
              totalValue={summary ? formatSol(summary.totalValueSol) : '--'}
              unit="SOL"
              stats={portfolioStats}
            />

            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <StatCard
                label="Average Occupancy"
                value={summary ? `${summary.averageOccupancy.toFixed(1)}%` : '--'}
                description="Sustained demand growth in East China facilities"
                borderColor="tertiary"
                progress={summary ? Math.round(summary.averageOccupancy) : 0}
              >
                <span className="material-symbols-outlined text-tertiary">monitoring</span>
              </StatCard>

              <StatCard
                label="Scarcity Status"
                value={summary ? summary.scarcityStatus.replaceAll('_', ' ') : '--'}
                borderColor="secondary"
              >
                <span className="material-symbols-outlined text-secondary">local_fire_department</span>
              </StatCard>
            </div>
          </div>

          {!walletAddress && (
            <div className="mt-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
              <p className="text-sm text-on-surface-variant">
                Connect your wallet to load portfolio yield data from backend.
              </p>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Yield Trend (Last 6 Months)</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container rounded-5xl text-xs font-bold text-on-surface-variant cursor-pointer">Daily</span>
                <span className="px-3 py-1 bg-primary text-white rounded-5xl text-xs font-bold cursor-pointer shadow-sm">Monthly</span>
              </div>
            </div>

            {trendQuery.isLoading && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <p className="text-sm text-on-surface-variant">Loading yield trend from backend...</p>
              </div>
            )}

            {trendQuery.isError && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-red-200">
                <p className="text-sm text-on-surface">
                  Failed to load yield trend: {trendQuery.error instanceof Error ? trendQuery.error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {!trendQuery.isLoading && !trendQuery.isError && chartBars.length > 0 && (
              <YieldChart bars={chartBars} />
            )}

            {!trendQuery.isLoading && !trendQuery.isError && chartBars.length === 0 && (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
                <p className="text-sm text-on-surface-variant">No yield trend points were returned by backend.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Quick Actions</h3>
            <div className="space-y-4">
              {quickActions.map(action => (
                <QuickActionCard
                  key={action.title}
                  href={'href' in action ? action.href : undefined}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold">Your BedRight NFTs</h3>
            <Link href="/facilities/assets" className="text-primary block text-center font-bold text-sm hover:underline">View All Assets</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftAssets.map(asset => (
              <NftCard
                key={asset.serial}
                {...asset}
                onManage={() => setIsAssetModalOpen(true)}
              />
            ))}

            <div className="bg-surface-container flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-outline-variant text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-5xl flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-4xl">add</span>
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg">Purchase New Asset</h4>
                <p className="text-sm text-on-surface-variant max-w-[180px] mx-auto">Expand your portfolio with fractional BedRight NFTs.</p>
              </div>
              <Link href="/facilities">
                <Button className="bg-primary text-white px-8 py-3 rounded-5xl font-bold shadow-md hover:scale-105 transition-all h-auto">
                  Browse Units
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <QueueAdmissionDialog isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
    </div>
  )
}
