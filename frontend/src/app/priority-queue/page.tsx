'use client'

import { useState } from 'react'
import { CheckInPaymentDialog } from '@/components/dialogs'
import { AppFooter } from '@/components/layout/app-footer'
import { ActivityFeedItem } from '@/components/queue/activity-feed-item'
import { BurnSlider } from '@/components/queue/burn-slider'
import { QueueChannel } from '@/components/queue/queue-channel'
import { SectionHeader } from '@/components/shared/section-header'
import { StatCard } from '@/components/shared/stat-card'

const p1Items = [
  { rank: 1, name: 'Wallet...7x9a', detail: 'BedRight #0842', status: 'Waiting: 2h' },
  { rank: 2, name: 'Wallet...3k1p', detail: 'BedRight #1105', status: 'Waiting: 5h' },
  { rank: 3, name: 'Wallet...m9v0', detail: 'BedRight #0023', status: 'Waiting: 8h' },
]

const p2Items = [
  { rank: 1, name: 'Wallet...z2b4', detail: 'Burned 15,000 $CARE', status: 'Rank: #43' },
  { rank: 2, name: 'Wallet...y8w1', detail: 'Burned 12,500 $CARE', status: 'Rank: #44' },
  { rank: 3, name: 'Wallet...p5r6', detail: 'Burned 10,000 $CARE', status: 'Rank: #45' },
]

const p3Items = [
  { rank: 1, name: 'Wallet...r3q1', detail: 'Joined: 2023.10.12', status: 'Rank: #242' },
  { rank: 2, name: 'Wallet...v4n8', detail: 'Joined: 2023.10.13', status: 'Rank: #243' },
  { rank: 3, name: 'Wallet...j2l5', detail: 'Joined: 2023.10.14', status: 'Rank: #244' },
]

const activities = [
  {
    icon: 'local_fire_department',
    iconColor: 'text-secondary',
    title: <><span className="font-bold">Wallet...9x2d</span> burned <span className="text-secondary font-bold">12,400 $CARE</span></>,
    subtitle: 'Rank Shift: #482 → #120',
    time: '12s ago',
  },
  {
    icon: 'check_circle',
    iconColor: 'text-tertiary',
    title: <><span className="font-bold">Wallet...c1e4</span> checked into <span className="text-tertiary font-bold">Singapore RWA Center</span></>,
    subtitle: 'Wait Time: 4.2 Days (VIP)',
    time: '4m ago',
  },
  {
    icon: 'person_add',
    iconColor: 'text-primary',
    title: <><span className="font-bold">Wallet...j3m1</span> joined <span className="text-on-surface font-bold">Standard Queue P3</span></>,
    subtitle: 'Current Position: #1,285',
    time: '8m ago',
  },
  {
    icon: 'bolt',
    iconColor: 'text-secondary',
    title: <><span className="font-bold">Wallet...q8v0</span> locked <span className="text-secondary font-bold">Top 10 of P2</span> via double burn</>,
    subtitle: 'Total Burned: 32,000 $CARE',
    time: '15m ago',
  },
]

export default function PriorityQueuePage() {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  return (
    <>
      <main className="max-w-[1440px] mx-auto px-8 pb-12 pt-24">
        {/* Hero Section: Queue Health */}
        <section className="mb-10">
          <SectionHeader
            title="Global Queue Status"
            description="Network-wide RWA Rehabilitation Bed Dynamic Ranking System"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Pending" value="1,284" borderColor="outline">
              <div className="flex gap-2 mt-4">
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-5xl">P1: 42</span>
                <span className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-5xl">P2: 156</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-500 rounded-5xl">P3: 1,086</span>
              </div>
            </StatCard>
            <StatCard label="Daily $CARE Burned" value="45,920" valueClassName="text-secondary" borderColor="outline" />
            <StatCard label="Avg Wait Time" value="14.2" description="days" borderColor="outline" progress={65} />
            <StatCard label="Bed Turnover Rate (QoQ)" value="98.2%" description="Asset Pool: Singapore #04-12 Rehab Center" borderColor="tertiary" />
          </div>
        </section>

        {/* The Three Channels (Central Focus) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <QueueChannel
            title="P1 - VIP Channel"
            subtitle="Highest"
            icon="workspace_premium"
            iconColor="text-primary"
            headerGradient="bg-gradient-to-r from-primary to-primary-container"
            badge="BedRight NFT Holders"
            badgeColor="bg-primary/10 text-primary"
            items={p1Items}
            viewAllText="View All VIPs (12)"
          />
          <QueueChannel
            title="P2 - Fast Track"
            subtitle="High"
            icon="bolt"
            iconColor="text-secondary"
            headerGradient="bg-gradient-to-r from-secondary to-secondary-container"
            badge="$CARE Burn Acceleration"
            badgeColor="bg-secondary/10 text-secondary"
            items={p2Items}
            viewAllText="View All P2 Rankings (88)"
          />
          <QueueChannel
            title="P3 - Standard Queue"
            subtitle="Standard"
            icon="groups"
            iconColor="text-slate-500"
            headerGradient="bg-slate-100"
            badge="Regular Waitlist"
            badgeColor="bg-slate-100 text-slate-400"
            items={p3Items}
            viewAllText="View Full Queue"
          />
        </div>

        {/* Middle Interaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="flex flex-col gap-8">
            <BurnSlider
              amount={5000}
              estimatedJump="+142 Positions"
              timeSaved="~4.5 Days"
              onConfirm={() => setIsCheckInOpen(true)}
            />

            {/* Bed Allocation Ready Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-5xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline">Bed Allocation Ready</h3>
                  <p className="text-sm text-on-surface-variant">Your priority slot has been confirmed at Singapore RWA Center.</p>
                </div>
              </div>
              <div className="bg-primary/5 p-6 rounded-2xl mb-8 flex items-center justify-between border border-primary/10">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Final Settlement</p>
                  <p className="text-2xl font-bold text-on-surface">12,500 <span className="text-sm font-normal">$CARE</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant mb-1">Reserved Slot</p>
                  <p className="text-sm font-bold text-on-surface">#04-12 Rehabilitation</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-auto">
                <button onClick={() => setIsCheckInOpen(true)} className="w-full bg-primary text-white py-5 rounded-5xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">payments</span>
                  Check-in & Pay Now
                </button>
                <p className="text-center text-[10px] text-on-surface-variant italic">By clicking check-in, you agree to the facility&apos;s admission protocol.</p>
              </div>
            </div>
          </div>

          {/* My Status Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-headline">My Status</h3>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-5xl text-xs font-bold uppercase">P2 Fast Track</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/5 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-primary/60 font-bold uppercase mb-1">Current Rank</span>
                <span className="text-3xl font-bold text-primary">#142</span>
                <span className="text-[10px] text-primary/60 mt-1">In Global Queue</span>
              </div>
              <div className="bg-secondary/5 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-secondary/60 font-bold uppercase mb-1">Expected Check-in</span>
                <span className="text-3xl font-bold text-secondary">3.5<small className="text-xs ml-0.5">days</small></span>
                <span className="text-[10px] text-secondary/60 mt-1">Based on History</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase mb-4 tracking-widest">Recent Activity History</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-5xl" />
                    <span className="text-on-surface">Burned 2,000 $CARE</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">2h ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-5xl" />
                    <span className="text-on-surface">Ranked up by 12 slots</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">Yesterday 14:20</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-5xl" />
                    <span className="text-on-surface">Entered P2 Fast Track</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">2023.10.15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed (Pulse) */}
        <section className="bg-surface-container-low rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-5xl bg-tertiary opacity-75" />
                <span className="relative inline-flex rounded-5xl h-3 w-3 bg-tertiary" />
              </span>
              <h3 className="text-xl font-bold font-headline">Real-time Pulse</h3>
            </div>
            <button className="text-xs text-primary font-bold hover:underline">View Block Explorer</button>
          </div>
          <div className="space-y-4 no-scrollbar overflow-y-auto max-h-64">
            {activities.map(activity => (
              <ActivityFeedItem key={activity.icon} {...activity} />
            ))}
          </div>
        </section>
      </main>
      <AppFooter />
      <CheckInPaymentDialog isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
    </>
  )
}
