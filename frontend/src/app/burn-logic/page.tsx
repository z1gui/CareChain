'use client'

import Link from 'next/link'
import AppFooter from '@/components/layout/app-footer'

export default function BurnLogicPage() {
  return (
    <>
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12">
        <header>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">Protocol Efficiency</span>
            <span className="h-px flex-1 bg-surface-container-highest" />
          </div>
          <h1 className="font-headline leading-tight font-bold text-[#0D4741] text-[32px] mb-6">
            Token Burn &amp; Priority Mechanism
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl font-light">
            The CareChain protocol ensures full transparency in asset allocation. Through dynamic $CARE burn logic, we align market demand with the availability of real-world healthcare assets.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Core Logic */}
          <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                <h2 className="text-xl font-bold font-headline">Queue Upgrade Core Logic</h2>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                <div className="w-full md:w-1/4 p-6 bg-surface-container-lowest rounded-xl text-center shadow-sm">
                  <span className="text-xs font-bold text-slate-400 block mb-2">ENTRY LEVEL</span>
                  <div className="text-xl font-bold mb-1">P3 Standard</div>
                  <div className="text-[10px] text-slate-500">Wait: Indefinite</div>
                </div>
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2 animate-pulse">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase">Burn $CARE</span>
                </div>
                <div className="w-full md:w-1/4 p-6 bg-white rounded-xl text-center shadow-lg ring-2 ring-primary/20 scale-105">
                  <span className="text-xs font-bold text-primary block mb-2">ACCELERATED</span>
                  <div className="text-xl font-bold text-primary mb-1">P2 Fast Track</div>
                  <div className="text-[10px] text-primary/70">Wait: 24-72 Hours</div>
                </div>
                <div className="hidden md:block">
                  <span className="material-symbols-outlined text-slate-300 text-4xl">chevron_right</span>
                </div>
                <div className="w-full md:w-1/4 p-6 bg-secondary-container text-white rounded-xl text-center shadow-sm">
                  <span className="text-xs font-bold opacity-80 block mb-2">FINAL BENEFIT</span>
                  <div className="text-xl font-bold mb-1">Asset Access</div>
                  <div className="text-[10px] opacity-70">RWA Bed Allocation</div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-primary">Mechanism:</span> Burn transactions trigger smart contract state changes. Once $CARE is verified as removed from circulating supply, the wallet address is immediately promoted to priority status.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 -mr-12 -mt-12">
              <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2v9a0-_GSKduBa8oF1GPjzrBhVAbb8sORmfIO4I8tqjuRA4tvoMGKz_Hb8-CW4QVdsGZi2s899H00IWGsaNsA8bpTCOEmJQDDnbIrIrlrzR4f3Yc4TS9rWI4aOTsaIz2WAbbzcJEf1y87yDGfyOVFGyroVvAl5-n69B2lnX_D5O71Synj0SarCXeZkegWKU6AeM4HM7YTfYz0jqa3PczLTDH2h9netbE_KYt9tqgM7Y2m7GD4OXmnAsj9EKeRNlFvoC7BhpLMTZhW" />
            </div>
          </div>

          {/* Dynamic Pricing */}
          <div className="lg:col-span-4 bg-surface-container-highest p-8 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary">bolt</span>
              <h2 className="text-xl font-bold font-headline">Dynamic Burn Pricing</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border-l-4 border-tertiary">
                <div>
                  <div className="text-xs font-bold text-slate-500">Queue Size &lt; 10</div>
                  <div className="text-lg font-bold">1x Base Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">10 $CARE</div>
                  <div className="text-[10px] text-slate-400">Per Day</div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border-l-4 border-primary">
                <div>
                  <div className="text-xs font-bold text-slate-500">Queue Size 10-50</div>
                  <div className="text-lg font-bold">1.5x Acceleration</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">15 $CARE</div>
                  <div className="text-[10px] text-slate-400">Per Day</div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border-l-4 border-secondary">
                <div>
                  <div className="text-xs font-bold text-slate-500">Queue Size &gt; 50</div>
                  <div className="text-lg font-bold">2x Scarcity Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">20 $CARE</div>
                  <div className="text-[10px] text-slate-400">Per Day</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2 bg-white/40 p-3 rounded-lg">
              <span className="material-symbols-outlined text-secondary text-sm">info</span>
              <p className="text-[10px] text-slate-600">Pricing updates per block, based on real-time queue demand data from Pyth Oracle.</p>
            </div>
          </div>
        </div>

        {/* Tokenomics Transparency Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-primary p-10 rounded-2xl text-white flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold font-headline mb-4">Dual Yield Tokenomics</h2>
              <p className="opacity-80 mb-8 max-w-md">Every burn event strengthens protocol value through a dual adjustment mechanism, rewarding our long-term holders.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="material-symbols-outlined mb-2">auto_delete</span>
                  <div className="text-lg font-bold">100% Permanently Removed</div>
                  <p className="text-[10px] opacity-70 mt-1">Circulating supply permanently decreases, creating continuous deflation.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="material-symbols-outlined mb-2">keyboard_double_arrow_up</span>
                  <div className="text-lg font-bold">50% Yield Redirection</div>
                  <p className="text-[10px] opacity-70 mt-1">Injected into YieldVault, boosting NFT staking rewards.</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-container rounded-full opacity-20 blur-3xl" />
          </div>
          <div className="bg-surface-container-low p-8 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-tertiary-container rounded-full mb-4">
                <span className="material-symbols-outlined text-white text-3xl">verified_user</span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Certified Deflation</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Our smart contracts are rigorously audited to ensure burned tokens are unrecoverable, maintaining a strictly decreasing supply curve.</p>
              <button className="mt-6 text-primary font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:underline">
                View Smart Contract Audit <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Comparison Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-headline mb-6 px-2">Access Tier Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-4">
                  <th className="pb-4 pl-6">Access Tier</th>
                  <th className="pb-4">Wait Time</th>
                  <th className="pb-4">Cost Structure</th>
                  <th className="pb-4">Priority Status</th>
                  <th className="pb-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-secondary/5 hover:bg-secondary/10 transition-colors group">
                  <td className="py-6 pl-6 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>diamond</span>
                      </div>
                      <div>
                        <div className="font-bold">P1 (VIP Access)</div>
                        <div className="text-[10px] text-secondary font-medium">BedRight NFT Holder</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 font-bold text-on-surface">Immediate / 0 Waiting</td>
                  <td className="py-6 text-slate-500 text-sm">Hold NFT Asset</td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-secondary text-white rounded-full text-[10px] font-bold">Highest Priority</span>
                  </td>
                  <td className="py-6 pr-6 rounded-r-2xl text-right">
                    <Link href="/facilities" className="text-secondary font-bold text-sm block">Browse NFTs →</Link>
                  </td>
                </tr>
                <tr className="bg-white hover:shadow-md transition-all">
                  <td className="py-6 pl-6 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">speed</span>
                      </div>
                      <div>
                        <div className="font-bold">P2 (Fast Track)</div>
                        <div className="text-[10px] text-primary font-medium">$CARE Burn Users</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 font-bold text-on-surface">24 - 72 Hours</td>
                  <td className="py-6 text-slate-500 text-sm">Dynamic $CARE Burn</td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold">Priority Access</span>
                  </td>
                  <td className="py-6 pr-6 rounded-r-2xl text-right">
                    <Link href="/buy-care" className="inline-block bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform">Burn to Upgrade</Link>
                  </td>
                </tr>
                <tr className="bg-surface-container-low opacity-60">
                  <td className="py-6 pl-6 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-400 rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">person</span>
                      </div>
                      <div>
                        <div className="font-bold">P3 (Standard)</div>
                        <div className="text-[10px] text-slate-500 font-medium">General Applicants</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 font-medium text-slate-500">Indefinite</td>
                  <td className="py-6 text-slate-500 text-sm">Free Application</td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-surface-container-highest text-slate-500 rounded-full text-[10px] font-bold">Lowest Priority</span>
                  </td>
                  <td className="py-6 pr-6 rounded-r-2xl text-right">
                    <span className="text-xs text-slate-400">In Queue</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 mb-20">
          <h2 className="text-2xl font-bold font-headline mb-8 text-center">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-surface-container-highest">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">Q</span>
                <h4 className="font-bold text-on-surface">What is the 30-day Cooling Period?</h4>
              </div>
              <p className="text-sm text-on-surface-variant pl-11 leading-relaxed">
                To prevent malicious market manipulation and excessive queue instability, all burn upgrade actions have a 30-day cooling period after taking effect. During this time, users cannot further increase their internal sub-priority within P2 through repeated burning, though they maintain their P2 status.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-surface-container-highest">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">Q</span>
                <h4 className="font-bold text-how-does-pyth-oracle-drive-dynamic-pricing">How does Pyth Oracle drive dynamic pricing?</h4>
              </div>
              <p className="text-sm text-on-surface-variant pl-11 leading-relaxed">
                CareChain utilizes Pyth Oracle's cross-chain price feeds and on-chain application data. When pending asset applications in the P3 queue exceed set thresholds (e.g., 10, 50), the contract automatically adjusts the burn multiplier to ensure protocol resources favor the highest-value demand.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/buy-care" className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
        <span className="material-symbols-outlined text-3xl group-hover:-translate-y-1 transition-transform">local_fire_department</span>
        <span className="absolute right-full mr-4 bg-on-surface text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Start Token Burn</span>
      </Link>

      <AppFooter />
    </>
  )
}
