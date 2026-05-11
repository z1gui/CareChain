'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFacilitiesQuery } from '@/apis/facilities/queries'
import { BuyNftDialog } from '@/components/dialogs'
import { FacilityCard } from '@/components/facility/facility-card'
import { FacilityFilterBar } from '@/components/facility/facility-filter-bar'
import { AppFooter } from '@/components/layout/app-footer'
import { SectionHeader } from '@/components/shared/section-header'

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
  const { data, isLoading, isError, error, refetch } = useQuery(getFacilitiesQuery())
  const facilities = data?.data?.items ?? []

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
          {isLoading && (
            <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant p-8 text-center">
              <p className="text-sm text-on-surface-variant">Loading facilities from backend...</p>
            </div>
          )}

          {isError && (
            <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-red-200 p-8 text-center">
              <p className="text-sm text-on-surface mb-4">
                Failed to load facilities: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && facilities.map(facility => (
            <FacilityCard
              key={facility.detailHref}
              {...facility}
              onBuyClick={() => setIsBuyNftOpen(true)}
            />
          ))}

          {!isLoading && !isError && facilities.length === 0 && (
            <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant p-8 text-center">
              <p className="text-sm text-on-surface-variant">No facilities returned by backend.</p>
            </div>
          )}

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
      <BuyNftDialog isOpen={isBuyNftOpen} onClose={() => setIsBuyNftOpen(false)} />
    </>
  )
}
