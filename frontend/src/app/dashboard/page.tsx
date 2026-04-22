'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PortfolioHero } from '@/components/dashboard/portfolio-hero'
import { QuickActionCard } from '@/components/dashboard/quick-action-card'
import { YieldChart } from '@/components/dashboard/yield-chart'
import { QueueAdmissionDialog } from '@/components/dialogs'
import { NftCard } from '@/components/facility/nft-card'
import { SectionHeader } from '@/components/shared/section-header'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'

const portfolioStats = [
  { label: 'Monthly Yield', value: '$95.50', unit: 'USDC', highlight: false },
  { label: 'Accrued Yield', value: '$1,240.12', unit: 'USDC', highlight: false },
  { label: 'Annual Yield', value: '8.2%', unit: 'APY', highlight: true },
]

const chartBars = [
  { label: 'Jan', height: '45%' },
  { label: 'Feb', height: '60%' },
  { label: 'Mar', height: '55%' },
  { label: 'Apr', height: '75%' },
  { label: 'May', height: '85%' },
  { label: 'Jun', height: '95%', isActive: true },
]

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
    buyPrice: '$4,500 USDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjnYydeQhaROgqoMGVzeSvZYy9rsGfI5eP9zPccTFXBoioAu28WUG9upkGonMLGSVWzNIE0MleVnO5rqjlWmR5lod4QHh7nA9seljCz0y4T8tMLYU7Bdxqsb0pnMV9vGn4FMlYT07f1hAl-rmeQi6OBebXiP0nkKd0rVdtSPdifxTZpufLI5L5Qt27pE50wFFvDAeGXWCDuZWRMwQqLIpjJm_b6IjMk9olqhTIi9C9cW0HBhuv1HTKpoAGBujqSha20Egs-2gnFwIe',
    type: 'Standard Bed',
    mode: 'Yield Mode',
  },
  {
    serial: 'FSH-B102',
    location: 'Boston Nursing Hub',
    yield: '7.8%',
    buyPrice: '$8,000 USDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE3N0Ug83WlqbU5bro2oHKRgIzDN88oPB0-w1ywYMHdOOMP4O8muP2ACbXD3X8PMTGjX4FqB0Jh0mU1AJOVSt-61GMDMyNOioqgg_ztQPUNdAMkMwywORsyQVbDMyfF5xRw8MAdjjrLVnnCqZMMFJDj6k-DuiTEL8x9GN5RH3FUe2G3ivOEY5FydNmwYy7At6RzDBqYJ8WUHJaFraaWmy3TcQyHvgWGk6ltcHLor_WxWnmMMXmKhhoVKW7qJAbYFLG-ysioSUPOYeL',
    type: 'Luxury Suite',
    mode: 'Occupancy Mode',
    queue: 'P1 Queue',
  },
]

export default function DashboardPage() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)

  return (
    <div className="min-h-screen pt-16 bg-surface">
      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-10">

        {/* Hero: My Total Portfolio */}
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
              totalValue="$12,500.00"
              unit="USDC"
              stats={portfolioStats}
            />

            {/* Side Insights */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <StatCard
                label="Average Occupancy"
                value="94.2%"
                description="Sustained demand growth in East China facilities"
                borderColor="tertiary"
                progress={94}
              >
                <span className="material-symbols-outlined text-tertiary">monitoring</span>
              </StatCard>

              <StatCard
                label="Scarcity Status"
                value="High Demand"
                borderColor="secondary"
              >
                <span className="material-symbols-outlined text-secondary">local_fire_department</span>
              </StatCard>
            </div>
          </div>
        </section>

        {/* Chart & Active Assets Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Yield Trend Chart Area (Spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Yield Trend (Last 6 Months)</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container rounded-5xl text-xs font-bold text-on-surface-variant cursor-pointer">Daily</span>
                <span className="px-3 py-1 bg-primary text-white rounded-5xl text-xs font-bold cursor-pointer shadow-sm">Monthly</span>
              </div>
            </div>
            <YieldChart bars={chartBars} />
          </div>

          {/* Secondary Actions Card */}
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

        {/* Active BedRight NFTs */}
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
