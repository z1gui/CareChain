'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FacilityCard } from '@/components/facility/FacilityCard'
import { FacilityFilterBar } from '@/components/facility/FacilityFilterBar'
import AppFooter from '@/components/layout/app-footer'
import { BuyNftModal } from '@/components/modals'
import { SectionHeader } from '@/components/shared/SectionHeader'

const facilities = [
  {
    name: 'Foshan Leyi Care Center',
    location: 'Foshan, Chancheng District',
    yield: '8.2%',
    occupancy: 94,
    totalBeds: 320,
    queueCount: 142,
    queueBoost: '20 $CARE/Day',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZpz9IugFANNkCrtJ4kYYbj60fZ43W5k0tKCtjPsK0fd8g-abMXW05gAiri-eSWOD_2_r6IGsKA3m-LidmT2Il0TU3FPFZSB4i-1-KcKPJS6tchAepEnGWrtTGJMvWBv52OYdD5DAo8vQRV1O59tCFN49dOyC__LJhR5Alu1mB2f980u9d4Yi-_KqjG9MswOTjklDJFXr35phNXEtv-AsOIiHsxuc0VhHfdkAfV1ANlaE2rRDe4gWfNN1RRfZxHn4mw8kE-sUf-bB_',
    badges: [
      { label: 'High Demand', variant: 'tertiary' as const },
      { label: 'RWA Certified', variant: 'default' as const },
    ],
    detailHref: '/facilities/1',
  },
  {
    name: 'Guangzhou Yuexiu Kangtai Court',
    location: 'Guangzhou, Yuexiu District',
    yield: '7.5%',
    occupancy: 88,
    totalBeds: 450,
    queueCount: 89,
    queueBoost: '15 $CARE/Day',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg1KE_t7YXRnW_fnCQ7moIublO3H8xKHTFGfP2Uhfc2avuXaY8g3Dm9m0qoJhJebUoNsswefU7awc5mGJLIy-27iU3-6DA1Y0T2rqP8wdnNQah1Fbt7clPjSzy9nY_imwE_OnyrHD4bJV3wFhX6ycxiQh6CJiMvCI57K8a25opcDNYb0CI87ASlXHaLRGuo-vR7NeplTcKeWriEBd9uzNTaS40tPVWO-aD_rWiTtwQ5ezWRMyTwqmI0GCFhh1XwT_A0YqIEi4LLa2K',
    badges: [
      { label: 'Newly Listed', variant: 'secondary' as const },
    ],
    detailHref: '/facilities/2',
  },
  {
    name: 'Shenzhen Futian Evergreen Residence',
    location: 'Shenzhen, Futian District',
    yield: '9.1%',
    occupancy: 98,
    totalBeds: 180,
    queueCount: 215,
    queueBoost: '35 $CARE/Day',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlizZlPSXbIeycQ66QVuNc4nPsVYn3A1iXlY05KOfu5G--FkkA_GF_v2GbamBzC4j3lLbBnGMwRtMOz3jusYK_5TYaDtunpiNJwzPWiN2BqhePbwxK1TzcY2q1FJbmQ-9dpmv-h6N-sfGPHS5gMAqBMs-JKB0FhYNKyI3FptHJT4oGfqI9FCcxfhOvPh9OqjlvUbjIPIhp6z8P_g0SyPkzU8qQ4tu7Jg9qlKxCVVK5iX03hL1432qvTFc6mGR3nOCTE4iGeqHGHa0b',
    badges: [
      { label: 'High Demand', variant: 'tertiary' as const },
    ],
    detailHref: '/facilities/3',
  },
]

const featuredOpportunities = [
  {
    name: 'Guangzhou Tianhe · Zhiyi Bay',
    yield: '12.5% Annual Yield',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-0b1HZUijV8lXMF-esxiY8T7LIrgp25q_L--jR_KetDWbJFr3n_ufYZvZ4T1vzyEO9ZQzdVWcokUJfl0jGBh-_BCjIXJIt7aiNMUCz1iZa10SlwfCgOIEC5v4hz7G2i2DHTSNcsj4cDZXG9O-UHaHh1XNqelC94AxoqDg7-U48umoCzsXYYlKlhl0tdQAkc-R3v_p8pWwMlJJyUNFBO02M_LIyMK2q5Vdb9hEv2UUZ6ThkmgJpJNQNC0-KPWsscC5W3CQaUNjA9sD',
  },
  {
    name: 'Foshan Nanhai · Senlinli',
    yield: '9.8% Annual Yield',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWGXOn5xQS5AdjfgZiRoxE8_SVkGUuzThrjZJ0-6WwB00zwMajLfHtVs6p2y_8RQ_ZgKTaaT_gGe-wNd1Xpu5gYl3GO1d-GTJBZrnoaFfaciRn9boXpWhWsDy6Dfp2cq1v-X-mkKhEA0w6EqnwyXZZ4-ATnP8oo_DVRVXe1w2BBlPEdt4pm_yzXEuGUYHORII2IwHSwuFZ1GjSbngbBEx2xLtRBsNUSKyKaE5whSP50Y7L8o6Moq7DbAr6e7pimxMY-8O8MS7J_Qdq',
  },
]

export default function FacilitiesPage() {
  const [isBuyNftOpen, setIsBuyNftOpen] = useState(false)

  return (
    <>
      <div className="pt-20 px-8 pb-12 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SectionHeader
          title="Explore Facilities"
          description="Invest in Real World Assets (RWA). Through CareChain, you can hold shares in high-quality wellness facilities, earning on-chain stable yields while supporting an aging society."
        />

        <FacilityFilterBar />

        {/* Facility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {facilities.map(facility => (
            <FacilityCard
              key={facility.name}
              {...facility}
              onBuyClick={() => setIsBuyNftOpen(true)}
            />
          ))}

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
              {featuredOpportunities.map(opp => (
                <div key={opp.name} className="flex gap-4 items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={opp.name} src={opp.image} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{opp.name}</h4>
                    <p className="text-xs text-outline mt-1 font-headline font-semibold">{opp.yield}</p>
                  </div>
                </div>
              ))}
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
      <AppFooter />
      <BuyNftModal isOpen={isBuyNftOpen} onClose={() => setIsBuyNftOpen(false)} />
    </>
  )
}
