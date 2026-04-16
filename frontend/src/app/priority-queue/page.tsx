'use client'

import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import { CheckInPaymentModal } from '@/components/modals'

export default function PriorityQueuePage() {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  return (
    <>
      <main className="max-w-[1440px] mx-auto px-8 pb-12 pt-24">
        {/* Hero Section: Queue Health */}
        <section className="mb-10">
          <h1 className="font-bold font-headline text-on-surface text-[32px] text-[#0D4741] mb-6">Global Queue Status</h1>
          <p className="text-on-surface-variant mb-6">Network-wide RWA Rehabilitation Bed Dynamic Ranking System</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-on-surface-variant">Total Pending</span>
                <span className="text-4xl font-bold font-headline text-primary mt-1">1,284</span>
                <div className="flex gap-2 mt-4">
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">P1: 42</span>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">P2: 156</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">P3: 1,086</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <span className="text-sm font-medium text-on-surface-variant">Daily $CARE Burned</span>
              <span className="text-4xl font-bold font-headline text-secondary mt-1">45,920</span>
              <div className="mt-4 flex items-center text-xs text-tertiary font-bold">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                +12.4% vs Yesterday
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <span className="text-sm font-medium text-on-surface-variant">Avg Wait Time</span>
              <span className="text-4xl font-bold font-headline text-on-surface mt-1">14.2<small className="text-lg ml-1 font-normal">days</small></span>
              <div className="mt-4 w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%]" />
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-tertiary">
              <span className="text-sm font-medium text-on-surface-variant">Bed Turnover Rate (QoQ)</span>
              <span className="text-4xl font-bold font-headline text-tertiary mt-1">98.2%</span>
              <p className="mt-4 text-xs text-on-surface-variant">Asset Pool: Singapore #04-12 Rehab Center</p>
            </div>
          </div>
        </section>

        {/* The Three Channels (Central Focus) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* P1 - VIP Channel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
                <h2 className="font-bold text-lg">P1 - VIP Channel</h2>
              </div>
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">BedRight NFT Holders</span>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-12px_rgba(0,104,95,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-container p-4 flex items-center justify-between">
                <span className="text-white text-xs font-bold">Priority Level: Highest</span>
                <span className="text-white/80 text-[10px]">NFT Anchor Privilege</span>
              </div>
              <div className="divide-y divide-slate-50">
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center text-amber-800 font-bold">1</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...7x9a</p>
                    <p className="text-[10px] text-on-surface-variant">BedRight #0842</p>
                  </div>
                  <span className="text-xs font-medium text-primary">Waiting: 2h</span>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">2</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...3k1p</p>
                    <p className="text-[10px] text-on-surface-variant">BedRight #1105</p>
                  </div>
                  <span className="text-xs font-medium text-primary">Waiting: 5h</span>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">3</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...m9v0</p>
                    <p className="text-[10px] text-on-surface-variant">BedRight #0023</p>
                  </div>
                  <span className="text-xs font-medium text-primary">Waiting: 8h</span>
                </div>
              </div>
              <button className="w-full py-4 text-xs font-bold text-primary hover:bg-slate-50 transition-all border-t border-slate-100">View All VIPs (12)</button>
            </div>
          </div>

          {/* P2 - Fast Track */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                <h2 className="font-bold text-lg">P2 - Fast Track</h2>
              </div>
              <span className="text-xs font-bold text-secondary px-3 py-1 bg-secondary/10 rounded-full">$CARE Burn Acceleration</span>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-12px_rgba(125,27,226,0.2)] overflow-hidden">
              <div className="bg-gradient-to-r from-secondary to-secondary-container p-4 flex items-center justify-between">
                <span className="text-white text-xs font-bold">Priority Level: High</span>
                <span className="text-white/80 text-[10px]">Real-time Bid Ranking</span>
              </div>
              <div className="divide-y divide-slate-50">
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold">1</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...z2b4</p>
                    <p className="text-[10px] text-secondary font-medium">Burned 15,000 $CARE</p>
                  </div>
                  <span className="text-xs font-medium text-secondary">Rank: #43</span>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">2</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...y8w1</p>
                    <p className="text-[10px] text-secondary font-medium">Burned 12,500 $CARE</p>
                  </div>
                  <span className="text-xs font-medium text-secondary">Rank: #44</span>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">3</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...p5r6</p>
                    <p className="text-[10px] text-secondary font-medium">Burned 10,000 $CARE</p>
                  </div>
                  <span className="text-xs font-medium text-secondary">Rank: #45</span>
                </div>
              </div>
              <button className="w-full py-4 text-xs font-bold text-secondary hover:bg-slate-50 transition-all border-t border-slate-100">View All P2 Rankings (88)</button>
            </div>
          </div>

          {/* P3 - Standard Queue */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">groups</span>
                <h2 className="font-bold text-lg">P3 - Standard Queue</h2>
              </div>
              <span className="text-xs font-medium text-slate-400 px-3 py-1 bg-slate-100 rounded-full">Regular Waitlist</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-100 p-4 flex items-center justify-between">
                <span className="text-slate-600 text-xs font-bold">Priority Level: Standard</span>
                <span className="text-slate-400 text-[10px]">First-Come, First-Served</span>
              </div>
              <div className="divide-y divide-slate-50">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">1</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...r3q1</p>
                    <p className="text-[10px] text-on-surface-variant">Joined: 2023.10.12</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Rank: #242</span>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">2</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...v4n8</p>
                    <p className="text-[10px] text-on-surface-variant">Joined: 2023.10.13</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Rank: #243</span>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">3</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Wallet...j2l5</p>
                    <p className="text-[10px] text-on-surface-variant">Joined: 2023.10.14</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Rank: #244</span>
                </div>
              </div>
              <button className="w-full py-4 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all border-t border-slate-100">View Full Queue</button>
            </div>
          </div>
        </div>

        {/* Middle Interaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="flex flex-col gap-8">
            {/* Boost My Position Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white">speed</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">Improve Ranking Slider</h3>
                <p className="text-sm text-on-surface-variant">Burn $CARE tokens to exchange for faster bed allocation</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Burn Amount</span>
                <div className="text-right">
                  <span className="text-3xl font-bold font-headline text-secondary">5,000</span>
                  <span className="text-sm text-secondary ml-1">$CARE</span>
                </div>
              </div>
              <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary" max="50000" min="100" step="100" type="range" />
              <div className="flex justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant">Estimated Jump</span>
                  <span className="text-lg font-bold text-tertiary">+142 Positions</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-on-surface-variant">Time Saved</span>
                  <span className="text-lg font-bold text-tertiary">~4.5 Days</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsCheckInOpen(true)} className="flex-1 bg-secondary text-white py-4 rounded-full font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">Confirm Burn &amp; Boost</button>
              <button className="px-6 border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-slate-50">Rules</button>
            </div>
          </div>

          {/* Bed Allocation Ready Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
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
              <button onClick={() => setIsCheckInOpen(true)} className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">payments</span>
                Check-in &amp; Pay Now
              </button>
              <p className="text-center text-[10px] text-on-surface-variant italic">By clicking check-in, you agree to the facility's admission protocol.</p>
            </div>
          </div>
          </div>

          {/* My Status Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-headline">My Status</h3>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase">P2 Fast Track</span>
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
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span className="text-on-surface">Burned 2,000 $CARE</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">2h ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-on-surface">Ranked up by 12 slots</span>
                  </div>
                  <span className="text-on-surface-variant text-xs">Yesterday 14:20</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary" />
              </span>
              <h3 className="text-xl font-bold font-headline">Real-time Pulse</h3>
            </div>
            <button className="text-xs text-primary font-bold hover:underline">View Block Explorer</button>
          </div>
          <div className="space-y-4 no-scrollbar overflow-y-auto max-h-64">
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">local_fire_department</span>
                <div>
                  <p className="text-sm"><span className="font-bold">Wallet...9x2d</span> burned <span className="text-secondary font-bold">12,400 $CARE</span></p>
                  <p className="text-[10px] text-on-surface-variant">Rank Shift: #482 → #120</p>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">12s ago</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <div>
                  <p className="text-sm"><span className="font-bold">Wallet...c1e4</span> checked into <span className="text-tertiary font-bold">Singapore RWA Center</span></p>
                  <p className="text-[10px] text-on-surface-variant">Wait Time: 4.2 Days (VIP)</p>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">4m ago</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <div>
                  <p className="text-sm"><span className="font-bold">Wallet...j3m1</span> joined <span className="text-on-surface font-bold">Standard Queue P3</span></p>
                  <p className="text-[10px] text-on-surface-variant">Current Position: #1,285</p>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">8m ago</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">bolt</span>
                <div>
                  <p className="text-sm"><span className="font-bold">Wallet...q8v0</span> locked <span className="text-secondary font-bold">Top 10 of P2</span> via double burn</p>
                  <p className="text-[10px] text-on-surface-variant">Total Burned: 32,000 $CARE</p>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">15m ago</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CheckInPaymentModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
    </>
  )
}
