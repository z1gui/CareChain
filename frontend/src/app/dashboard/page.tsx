'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QueueAdmissionModal } from '@/components/modals'

export default function DashboardPage() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)

  return (
    <div className="min-h-screen pt-16 bg-surface">
      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-10">

        {/* Hero: My Total Portfolio */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-6">
            <div>
              <span className="text-sm font-label font-bold text-primary uppercase tracking-[0.2em] mb-2 block">
                Sovereign Sanctuary
              </span>
              <h1 className="text-[32px] font-headline font-bold text-[#0D4741] leading-tight mb-2">
                Portfolio Details
              </h1>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-bold px-4 py-2 rounded-5xl text-sm flex items-center gap-2 hover:bg-white shadow-sm transition-all">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Statement
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Portfolio Stats Bento */}
            <div className="lg:col-span-8 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl shadow-xl text-on-primary flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-5xl blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute right-20 bottom-10 w-32 h-32 bg-secondary/20 rounded-5xl blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  <span className="text-xs font-label uppercase tracking-widest font-semibold">Portfolio Value</span>
                </div>
                <div className="text-5xl font-headline font-black mb-8 tracking-tight">
                  $12,500.00 <span className="text-2xl font-medium opacity-70">USDC</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-1 border-l border-white/20 pl-4">
                    <span className="text-xs font-label uppercase opacity-80 block">Monthly Yield</span>
                    <div className="text-xl font-bold font-headline">$95.50 <span className="text-sm opacity-80">USDC</span></div>
                  </div>
                  <div className="space-y-1 border-l border-white/20 pl-4">
                    <span className="text-xs font-label uppercase opacity-80 block">Accrued Yield</span>
                    <div className="text-xl font-bold font-headline">$1,240.12 <span className="text-sm opacity-80">USDC</span></div>
                  </div>
                  <div className="space-y-1 border-l border-white/20 pl-4">
                    <span className="text-xs font-label uppercase opacity-80 block">Annual Yield</span>
                    <div className="text-xl font-bold font-headline text-tertiary-fixed">8.2% <span className="text-sm opacity-80 font-normal">APY</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4 relative z-10">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold px-6 py-3 rounded-5xl transition-all text-sm">Compound</button>
                <button className="bg-secondary text-white font-bold px-6 py-3 rounded-5xl shadow-lg hover:scale-105 transition-all text-sm">Add Assets</button>
              </div>
            </div>

            {/* Side Insights */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border-l-4 border-tertiary">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-label font-bold text-outline uppercase tracking-wider">Average Occupancy</span>
                  <span className="material-symbols-outlined text-tertiary">monitoring</span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-headline font-extrabold text-on-surface">94.2%</div>
                  <p className="text-xs text-on-surface-variant mt-1">Sustained demand growth in East China facilities</p>
                </div>
                <div className="mt-4 w-full h-1.5 bg-surface-container rounded-5xl overflow-hidden">
                  <div className="h-full bg-tertiary rounded-5xl" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border-l-4 border-secondary">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-label font-bold text-outline uppercase tracking-wider">Scarcity Status</span>
                  <span className="material-symbols-outlined text-secondary">local_fire_department</span>
                </div>
                <div className="mt-4">
                  <div className="text-xl font-headline font-bold text-secondary">High Demand</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-medium text-on-surface">P3 Queue &gt; 50+</span>
                    <span className="text-xs text-on-surface-variant">applicants</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center bg-secondary/5 p-2 rounded-lg">
                  <span className="text-xs font-medium text-on-surface-variant">Queue Jump Cost</span>
                  <span className="text-sm font-bold text-secondary">20 $CARE / Day</span>
                </div>
              </div>
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

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm h-72 flex flex-col relative overflow-hidden">
              <div className="flex-grow flex items-end justify-between gap-2 pt-10">
                {/* Simulated Chart Bars */}
                <div className="w-full flex items-end justify-around h-full px-2 relative z-10">
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all" style={{ height: '45%' }} />
                    <span className="text-[10px] mt-2 font-label text-outline uppercase">Jan</span>
                  </div>
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all" style={{ height: '60%' }} />
                    <span className="text-[10px] mt-2 font-label text-outline uppercase">Feb</span>
                  </div>
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all" style={{ height: '55%' }} />
                    <span className="text-[10px] mt-2 font-label text-outline uppercase">Mar</span>
                  </div>
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all" style={{ height: '75%' }} />
                    <span className="text-[10px] mt-2 font-label text-outline uppercase">Apr</span>
                  </div>
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-surface-container-high group-hover:bg-primary-fixed-dim rounded-t-lg transition-all" style={{ height: '85%' }} />
                    <span className="text-[10px] mt-2 font-label text-outline uppercase">May</span>
                  </div>
                  <div className="group relative flex flex-col items-center w-12">
                    <div className="w-full bg-primary-container rounded-t-lg shadow-[0_-8px_20px_rgba(0,131,120,0.2)]" style={{ height: '95%' }} />
                    <span className="text-[10px] mt-2 font-label text-primary font-bold uppercase">Jun</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 grid grid-rows-4 pointer-events-none p-6 py-10 opacity-10">
                <div className="border-b border-on-surface" />
                <div className="border-b border-on-surface" />
                <div className="border-b border-on-surface" />
                <div className="border-b border-on-surface" />
              </div>
            </div>
          </div>

          {/* Secondary Actions Card */}
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Quick Actions</h3>
            <div className="space-y-4">
              <Link href="/facilities" className="block w-full p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">explore</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">Explore Facilities</div>
                  <div className="text-xs text-on-surface-variant">Discover new RWA healthcare real estate units</div>
                </div>
              </Link>
              <Link href="/buy-care" className="block w-full p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">Buy $CARE</div>
                  <div className="text-xs text-on-surface-variant">Access the priority queue system</div>
                </div>
              </Link>
              <button className="w-full p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">Governance Voting</div>
                  <div className="text-xs text-on-surface-variant">Propose or vote on asset protocols</div>
                </div>
              </button>
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
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-outline-variant/10">
              <div className="h-48 relative overflow-hidden">
                <img
                  alt="clean modern medical care room"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjnYydeQhaROgqoMGVzeSvZYy9rsGfI5eP9zPccTFXBoioAu28WUG9upkGonMLGSVWzNIE0MleVnO5rqjlWmR5lod4QHh7nA9seljCz0y4T8tMLYU7Bdxqsb0pnMV9vGn4FMlYT07f1hAl-rmeQi6OBebXiP0nkKd0rVdtSPdifxTZpufLI5L5Qt27pE50wFFvDAeGXWCDuZWRMwQqLIpjJm_b6IjMk9olqhTIi9C9cW0HBhuv1HTKpoAGBujqSha20Egs-2gnFwIe"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-5xl text-[10px] font-bold text-white uppercase">Standard Bed</div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-tertiary-container text-on-tertiary-container rounded text-[10px] font-bold">Yield Mode</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold font-headline">FSH-A301</h4>
                  <div className="text-right">
                    <div className="text-xs font-label uppercase text-outline">APY</div>
                    <div className="text-lg font-black text-tertiary">7.2%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm py-3 border-y border-outline-variant/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-outline">Location</span>
                    <span className="font-medium">SF Health Center</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-outline">Buy Price</span>
                    <span className="font-medium">$4,500 USDC</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all" onClick={() => setIsAssetModalOpen(true)}>Manage Asset</button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-outline-variant/10">
              <div className="h-48 relative overflow-hidden">
                <img
                  alt="luxury medical suite"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3N0Ug83WlqbU5bro2oHKRgIzDN88oPB0-w1ywYMHdOOMP4O8muP2ACbXD3X8PMTGjX4FqB0Jh0mU1AJOVSt-61GMDMyNOioqgg_ztQPUNdAMkMwywORsyQVbDMyfF5xRw8MAdjjrLVnnCqZMMFJDj6k-DuiTEL8x9GN5RH3FUe2G3ivOEY5FydNmwYy7At6RzDBqYJ8WUHJaFraaWmy3TcQyHvgWGk6ltcHLor_WxWnmMMXmKhhoVKW7qJAbYFLG-ysioSUPOYeL"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-5xl text-[10px] font-bold text-white uppercase">Luxury Suite</div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2 py-1 bg-secondary text-white rounded text-[10px] font-bold">Occupancy Mode</span>
                  <span className="px-2 py-1 bg-white/90 text-on-surface rounded text-[10px] font-bold">P1 Queue</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold font-headline">FSH-B102</h4>
                  <div className="text-right">
                    <div className="text-xs font-label uppercase text-outline">APY</div>
                    <div className="text-lg font-black text-secondary">7.8%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm py-3 border-y border-outline-variant/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-outline">Location</span>
                    <span className="font-medium">Boston Nursing Hub</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-outline">Buy Price</span>
                    <span className="font-medium">$8,000 USDC</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all" onClick={() => setIsAssetModalOpen(true)}>Manage Asset</button>
              </div>
            </div>

            <div className="bg-surface-container flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-outline-variant text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-5xl flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-4xl">add</span>
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg">Purchase New Asset</h4>
                <p className="text-sm text-on-surface-variant max-w-[180px] mx-auto">Expand your portfolio with fractional BedRight NFTs.</p>
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-5xl font-bold shadow-md hover:scale-105 transition-all">Browse Units</button>
            </div>
          </div>
        </section>
      </main>
      <QueueAdmissionModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
    </div>
  )
}
