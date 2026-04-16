'use client'

import Link from 'next/link'
import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import { BuyNftModal } from '@/components/modals'

export default function FacilitiesPage() {
  const [isBuyNftOpen, setIsBuyNftOpen] = useState(false)

  return (
    <>
      <div className="pt-20 px-8 pb-12 max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Hero Header */}
        <header className="mb-12">
          <h1 className="font-extrabold text-on-surface font-headline tracking-tight text-[32px] text-[#0D4741] mb-6">Explore Facilities</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Invest in Real World Assets (RWA). Through CareChain, you can hold shares in high-quality wellness facilities, earning on-chain stable yields while supporting an aging society.
          </p>
        </header>

        {/* Filters and Search */}
        <section className="bg-surface-container-low p-6 rounded-xl mb-12 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">Search Facilities</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface" placeholder="Enter name or location..." type="text" />
            </div>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">Region</label>
            <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
              <option>All Regions</option>
              <option>Foshan</option>
              <option>Guangzhou</option>
              <option>Shenzhen</option>
            </select>
          </div>
          <div className="w-44">
            <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">Room Type</label>
            <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
              <option>Standard Room</option>
              <option>Suite</option>
              <option>Memory Care</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-outline mb-2 uppercase tracking-wider">Sort By</label>
            <select className="w-full py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface">
              <option>Expected Yield</option>
              <option>Occupancy</option>
              <option>Newest Listing</option>
            </select>
          </div>
        </section>

        {/* Facility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-primary/10">
            <div className="h-56 relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Modern high-end elderly care facility" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZpz9IugFANNkCrtJ4kYYbj60fZ43W5k0tKCtjPsK0fd8g-abMXW05gAiri-eSWOD_2_r6IGsKA3m-LidmT2Il0TU3FPFZSB4i-1-KcKPJS6tchAepEnGWrtTGJMvWBv52OYdD5DAo8vQRV1O59tCFN49dOyC__LJhR5Alu1mB2f980u9d4Yi-_KqjG9MswOTjklDJFXr35phNXEtv-AsOIiHsxuc0VhHfdkAfV1ANlaE2rRDe4gWfNN1RRfZxHn4mw8kE-sUf-bB_" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold font-headline">High Demand</span>
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold font-headline">RWA Certified</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface font-headline">Foshan Leyi Care Center</h3>
                  <div className="flex items-center text-on-surface-variant text-sm mt-1">
                    <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                    Foshan, Chancheng District
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-tertiary font-headline">8.2%</span>
                  <div className="text-[10px] text-outline font-bold uppercase">Expected Yield</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Occupancy</div>
                  <div className="text-sm font-bold text-on-surface">94%</div>
                  <div className="h-1 bg-surface-container-highest mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-[94%]" />
                  </div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Total Beds</div>
                  <div className="text-sm font-bold text-on-surface">320</div>
                </div>
                <div className="bg-secondary-fixed p-3 rounded-lg">
                  <div className="text-xs text-on-secondary-fixed-variant mb-1">P3 Queue</div>
                  <div className="text-sm font-bold text-on-secondary-fixed">142 People</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>speed</span>
                  <span className="text-xs font-medium">Queue Boost: <span className="font-bold">20 $CARE/Day</span></span>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">info</span>
              </div>
              <div className="flex gap-3">
                <Link href="/facilities/1" className="flex-1 py-3 bg-surface-container-high text-on-surface text-center font-bold rounded-lg hover:bg-surface-dim transition-colors">Details</Link>
                <button onClick={() => setIsBuyNftOpen(true)} className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity active:scale-95">Buy NFT</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-primary/10">
            <div className="h-56 relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Sleek healthcare facility corridor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg1KE_t7YXRnW_fnCQ7moIublO3H8xKHTFGfP2Uhfc2avuXaY8g3Dm9m0qoJhJebUoNsswefU7awc5mGJLIy-27iU3-6DA1Y0T2rqP8wdnNQah1Fbt7clPjSzy9nY_imwE_OnyrHD4bJV3wFhX6ycxiQh6CJiMvCI57K8a25opcDNYb0CI87ASlXHaLRGuo-vR7NeplTcKeWriEBd9uzNTaS40tPVWO-aD_rWiTtwQ5ezWRMyTwqmI0GCFhh1XwT_A0YqIEi4LLa2K" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold font-headline">Newly Listed</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface font-headline">Guangzhou Yuexiu Kangtai Court</h3>
                  <div className="flex items-center text-on-surface-variant text-sm mt-1">
                    <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                    Guangzhou, Yuexiu District
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-tertiary font-headline">7.5%</span>
                  <div className="text-[10px] text-outline font-bold uppercase">Expected Yield</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Occupancy</div>
                  <div className="text-sm font-bold text-on-surface">88%</div>
                  <div className="h-1 bg-surface-container-highest mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-[88%]" />
                  </div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Total Beds</div>
                  <div className="text-sm font-bold text-on-surface">450</div>
                </div>
                <div className="bg-secondary-fixed p-3 rounded-lg">
                  <div className="text-xs text-on-secondary-fixed-variant mb-1">P3 Queue</div>
                  <div className="text-sm font-bold text-on-secondary-fixed">89 People</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>speed</span>
                  <span className="text-xs font-medium">Queue Boost: <span className="font-bold">15 $CARE/Day</span></span>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">info</span>
              </div>
              <div className="flex gap-3">
                <Link href="/facilities/2" className="flex-1 py-3 bg-surface-container-high text-on-surface text-center font-bold rounded-lg hover:bg-surface-dim transition-colors">Details</Link>
                <button onClick={() => setIsBuyNftOpen(true)} className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity active:scale-95">Buy NFT</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-primary/10">
            <div className="h-56 relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Bright and airy common area" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlizZlPSXbIeycQ66QVuNc4nPsVYn3A1iXlY05KOfu5G--FkkA_GF_v2GbamBzC4j3lLbBnGMwRtMOz3jusYK_5TYaDtunpiNJwzPWiN2BqhePbwxK1TzcY2q1FJbmQ-9dpmv-h6N-sfGPHS5gMAqBMs-JKB0FhYNKyI3FptHJT4oGfqI9FCcxfhOvPh9OqjlvUbjIPIhp6z8P_g0SyPkzU8qQ4tu7Jg9qlKxCVVK5iX03hL1432qvTFc6mGR3nOCTE4iGeqHGHa0b" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold font-headline">High Demand</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface font-headline">Shenzhen Futian Evergreen Residence</h3>
                  <div className="flex items-center text-on-surface-variant text-sm mt-1">
                    <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                    Shenzhen, Futian District
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-tertiary font-headline">9.1%</span>
                  <div className="text-[10px] text-outline font-bold uppercase">Expected Yield</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Occupancy</div>
                  <div className="text-sm font-bold text-on-surface">98%</div>
                  <div className="h-1 bg-surface-container-highest mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-[98%]" />
                  </div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <div className="text-xs text-outline mb-1">Total Beds</div>
                  <div className="text-sm font-bold text-on-surface">180</div>
                </div>
                <div className="bg-secondary-fixed p-3 rounded-lg">
                  <div className="text-xs text-on-secondary-fixed-variant mb-1">P3 Queue</div>
                  <div className="text-sm font-bold text-on-secondary-fixed">215 People</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>speed</span>
                  <span className="text-xs font-medium">Queue Boost: <span className="font-bold">35 $CARE/Day</span></span>
                </div>
                <span className="material-symbols-outlined text-outline text-sm">info</span>
              </div>
              <div className="flex gap-3">
                <Link href="/facilities/3" className="flex-1 py-3 bg-surface-container-high text-on-surface text-center font-bold rounded-lg hover:bg-surface-dim transition-colors">Details</Link>
                <button onClick={() => setIsBuyNftOpen(true)} className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity active:scale-95">Buy NFT</button>
              </div>
            </div>
          </div>

          {/* Card 4 (Empty State) */}
          <div className="bg-surface-container-low rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant p-8 opacity-60">
            <span className="material-symbols-outlined text-4xl mb-4 text-outline">domain_add</span>
            <p className="font-headline font-semibold text-outline">More assets under review...</p>
          </div>
        </div>

        {/* Bottom sections */}
        <aside className="flex flex-col lg:flex-row gap-8 mt-12">
          <section className="flex-1 bg-surface-container-low rounded-xl p-6">
            <h3 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Featured Opportunities
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-center group cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Exterior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-0b1HZUijV8lXMF-esxiY8T7LIrgp25q_L--jR_KetDWbJFr3n_ufYZvZ4T1vzyEO9ZQzdVWcokUJfl0jGBh-_BCjIXJIt7aiNMUCz1iZa10SlwfCgOIEC5v4hz7G2i2DHTSNcsj4cDZXG9O-UHaHh1XNqelC94AxoqDg7-U48umoCzsXYYlKlhl0tdQAkc-R3v_p8pWwMlJJyUNFBO02M_LIyMK2q5Vdb9hEv2UUZ6ThkmgJpJNQNC0-KPWsscC5W3CQaUNjA9sD" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">Guangzhou Tianhe · Zhiyi Bay</h4>
                  <p className="text-xs text-outline mt-1 font-headline font-semibold">12.5% Annual Yield</p>
                </div>
              </div>
              <div className="flex gap-4 items-center group cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWGXOn5xQS5AdjfgZiRoxE8_SVkGUuzThrjZJ0-6WwB00zwMajLfHtVs6p2y_8RQ_ZgKTaaT_gGe-wNd1Xpu5gYl3GO1d-GTJBZrnoaFfaciRn9boXpWhWsDy6Dfp2cq1v-X-mkKhEA0w6EqnwyXZZ4-ATnP8oo_DVRVXe1w2BBlPEdt4pm_yzXEuGUYHORII2IwHSwuFZ1GjSbngbBEx2xLtRBsNUSKyKaE5whSP50Y7L8o6Moq7DbAr6e7pimxMY-8O8MS7J_Qdq" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">Foshan Nanhai · Senlinli</h4>
                  <p className="text-xs text-outline mt-1 font-headline font-semibold">9.8% Annual Yield</p>
                </div>
              </div>
            </div>
            <Link href="/facilities/assets" className="w-full mt-8 py-3 text-sm block text-center font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
              View All New Assets
            </Link>
          </section>

          <section className="flex-1 bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-on-primary">
            <h3 className="text-lg font-bold font-headline mb-3">Your Portfolio</h3>
            <p className="text-sm opacity-80 mb-6">View your held RWA asset shares and their daily yield distributions.</p>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 mb-6">
              <div className="text-xs uppercase opacity-60 font-bold mb-1">Total Assets</div>
              <div className="text-2xl font-extrabold font-headline">128,450.00 <span className="text-sm font-normal">USDC</span></div>
            </div>
            <Link href="/dashboard" className="w-full py-3 bg-on-primary text-primary text-center block font-bold rounded-lg active:scale-95 transition-transform">
              Open Dashboard
            </Link>
          </section>

          <section className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h4 className="text-sm font-bold text-on-surface font-headline mb-4">Market Announcements</h4>
            <div className="space-y-4">
              <div className="pb-4 border-b border-surface-container">
                <span className="text-[10px] font-bold text-secondary-container bg-secondary/10 px-2 py-0.5 rounded">WEB3</span>
                <p className="text-xs font-medium mt-2">CareChain V2 smart contract audit passed; RWA mapping efficiency improved by 40%.</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-tertiary-container bg-tertiary/10 px-2 py-0.5 rounded">ASSET UPDATES</span>
                <p className="text-xs font-medium mt-2">Foshan Leyi Care Center completed Q2 dividends, distributing 1.2 USDC per share.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
      <Footer />
      <BuyNftModal isOpen={isBuyNftOpen} onClose={() => setIsBuyNftOpen(false)} />
    </>
  )
}
