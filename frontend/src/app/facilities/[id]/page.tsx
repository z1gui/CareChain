'use client'

import Link from 'next/link'
import { useState, use } from 'react'
import { BuyNftDialog, QueueAdmissionDialog } from '@/components/dialogs'
import { AppFooter } from '@/components/layout/app-footer'

interface FacilityDetail {
  name: string
  subtitle: string
  location: string
  description: string
  image: string
  annualYield: string
  annualYieldDelta: string
  occupancyRate: number
  totalCapacity: number
  remainingUnits: number
  overviewText: string
  overviewImages: [string, string]
}

const facilitiesData: Record<string, FacilityDetail> = {
  '1': {
    name: 'Foshan Leyi Care Center',
    subtitle: 'Premium Medical Care',
    location: 'Foshan, Guangdong',
    description: 'A flagship RWA elderly care facility integrated with CareChain on-chain governance. Providing top-tier clinical support and premium hospitality services for quality senior living.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7kEoBbqYvfjpiMwMKKPPeHuTlweIxOza3CUT74TRchRK5IAuy-0rOF2JgkDIzoQ5RmgCXxGVsYKXikgsAE0XyFHu_ewMFKWT5RRrINbW9fwknZJ1w0yRH5O8c-31AqCIKoE8DYacALxtG9OuqYmny5IFlsq7xOMJ4Q1pPmVKCyR_VIdI0r-IjXlJx9CN5qMnU3WQ4-lmZP8Fx5IHycMfjFBwzv3BVVG3yfy2eCp844UzmFmWgsfcsstzRgPw1IgNI31CjnFE_hMeH',
    annualYield: '8.2%',
    annualYieldDelta: '+0.4% from last period',
    occupancyRate: 94,
    totalCapacity: 320,
    remainingUnits: 12,
    overviewText: 'Foshan Leyi Care Center represents the highest standard of medical and elderly care integration. Located in the heart of the Greater Bay Area, it features 24,000 m² of rehabilitation space.',
    overviewImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB98CMKw-lByzcpfhiGgsYZC0Ieg61sytysXuQnZ4BX6bJ4DAQxVnToeRqX_qcCnmMevKpjaeoq605wGrBTckDT3DseADx_OmS-aduSmHFAEAq5o2Zeqvgd4olo3E00SJLdHQnR2Va76tGY-VXZHwHLAGnnjf3lWV3l-QgZjFvR78JD1H4OVxrDlKvResHAEMS-SjfmN04YhGtC2mX4BdC6dv6pRnwkDwVtcCBSaUW7MTqAPLA-4MbVQyn3ZeZi_BUTX6i6MtwvgbRE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9-cZ6AcOGNXliEGldsuCtxemdMp6MfFAYUmS8ImsZNVyilMjOqevAldW91QPXMHy4K3cBAdrrIoVIZNLQV3e7BC8lm1cWjVr3YRNHE8Myxb_46R1yZy0goU5BENHQNC93DvEGwzgzd8XwiSweLBct1wvpf2yysj7QSrSHeQdgEu3VmI9rDV0G30eoyAeUOZmLIG9PtKRXX_YnthGDV9JI_dbal8tdkBup8UfxXgC3u0nRzR-u00jtt-OK6lvPLqg9vak8eml5m6s',
    ],
  },
  '2': {
    name: 'Guangzhou Yuexiu Kangtai Court',
    subtitle: 'Comprehensive Senior Care',
    location: 'Guangzhou, Yuexiu',
    description: 'A premium senior care facility in the heart of Guangzhou, offering comprehensive medical and wellness services with state-of-the-art amenities and on-chain governance.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg1KE_t7YXRnW_fnCQ7moIublO3H8xKHTFGfP2Uhfc2avuXaY8g3Dm9m0qoJhJebUoNsswefU7awc5mGJLIy-27iU3-6DA1Y0T2rqP8wdnNQah1Fbt7clPjSzy9nY_imwE_OnyrHD4bJV3wFhX6ycxiQh6CJiMvCI57K8a25opcDNYb0CI87ASlXHaLRGuo-vR7NeplTcKeWriEBd9uzNTaS40tPVWO-aD_rWiTtwQ5ezWRMyTwqmI0GCFhh1XwT_A0YqIEi4LLa2K',
    annualYield: '7.5%',
    annualYieldDelta: '+0.2% from last period',
    occupancyRate: 88,
    totalCapacity: 450,
    remainingUnits: 54,
    overviewText: 'Guangzhou Yuexiu Kangtai Court is a newly listed premium elderly care facility in Yuexiu District, offering extensive rehabilitation services across 30,000 m² of modern care space.',
    overviewImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB98CMKw-lByzcpfhiGgsYZC0Ieg61sytysXuQnZ4BX6bJ4DAQxVnToeRqX_qcCnmMevKpjaeoq605wGrBTckDT3DseADx_OmS-aduSmHFAEAq5o2Zeqvgd4olo3E00SJLdHQnR2Va76tGY-VXZHwHLAGnnjf3lWV3l-QgZjFvR78JD1H4OVxrDlKvResHAEMS-SjfmN04YhGtC2mX4BdC6dv6pRnwkDwVtcCBSaUW7MTqAPLA-4MbVQyn3ZeZi_BUTX6i6MtwvgbRE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9-cZ6AcOGNXliEGldsuCtxemdMp6MfFAYUmS8ImsZNVyilMjOqevAldW91QPXMHy4K3cBAdrrIoVIZNLQV3e7BC8lm1cWjVr3YRNHE8Myxb_46R1yZy0goU5BENHQNC93DvEGwzgzd8XwiSweLBct1wvpf2yysj7QSrSHeQdgEu3VmI9rDV0G30eoyAeUOZmLIG9PtKRXX_YnthGDV9JI_dbal8tdkBup8UfxXgC3u0nRzR-u00jtt-OK6lvPLqg9vak8eml5m6s',
    ],
  },
  '3': {
    name: 'Shenzhen Futian Evergreen Residence',
    subtitle: 'Elite Wellness Living',
    location: 'Shenzhen, Futian',
    description: "Shenzhen's highest-demand luxury senior living facility, providing elite wellness programs and cutting-edge medical support in a vibrant urban environment.",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlizZlPSXbIeycQ66QVuNc4nPsVYn3A1iXlY05KOfu5G--FkkA_GF_v2GbamBzC4j3lLbBnGMwRtMOz3jusYK_5TYaDtunpiNJwzPWiN2BqhePbwxK1TzcY2q1FJbmQ-9dpmv-h6N-sfGPHS5gMAqBMs-JKB0FhYNKyI3FptHJT4oGfqI9FCcxfhOvPh9OqjlvUbjIPIhp6z8P_g0SyPkzU8qQ4tu7Jg9qlKxCVVK5iX03hL1432qvTFc6mGR3nOCTE4iGeqHGHa0b',
    annualYield: '9.1%',
    annualYieldDelta: '+0.7% from last period',
    occupancyRate: 98,
    totalCapacity: 180,
    remainingUnits: 4,
    overviewText: 'Shenzhen Futian Evergreen Residence is the most sought-after elderly care facility in the Greater Bay Area. With 98% occupancy, it provides elite wellness programs in 18,000 m² of premium living space.',
    overviewImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB98CMKw-lByzcpfhiGgsYZC0Ieg61sytysXuQnZ4BX6bJ4DAQxVnToeRqX_qcCnmMevKpjaeoq605wGrBTckDT3DseADx_OmS-aduSmHFAEAq5o2Zeqvgd4olo3E00SJLdHQnR2Va76tGY-VXZHwHLAGnnjf3lWV3l-QgZjFvR78JD1H4OVxrDlKvResHAEMS-SjfmN04YhGtC2mX4BdC6dv6pRnwkDwVtcCBSaUW7MTqAPLA-4MbVQyn3ZeZi_BUTX6i6MtwvgbRE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9-cZ6AcOGNXliEGldsuCtxemdMp6MfFAYUmS8ImsZNVyilMjOqevAldW91QPXMHy4K3cBAdrrIoVIZNLQV3e7BC8lm1cWjVr3YRNHE8Myxb_46R1yZy0goU5BENHQNC93DvEGwzgzd8XwiSweLBct1wvpf2yysj7QSrSHeQdgEu3VmI9rDV0G30eoyAeUOZmLIG9PtKRXX_YnthGDV9JI_dbal8tdkBup8UfxXgC3u0nRzR-u00jtt-OK6lvPLqg9vak8eml5m6s',
    ],
  },
}

export default function FacilityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const facility = facilitiesData[id] ?? facilitiesData['1']

  const [isBuyNftOpen, setIsBuyNftOpen] = useState(false)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)

  return (
    <>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Hero Section */}
        <section className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl group">
          <Link href="/facilities" className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-5xl transition-all shadow-lg active:scale-95 group/back" title="Back to facilities list">
            <span className="material-symbols-outlined transition-transform group-hover/back:-translate-x-1">arrow_back</span>
          </Link>
          <img alt={facility.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={facility.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-100 text-xs font-bold rounded-5xl uppercase tracking-wider">Active Asset</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-5xl flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span> {facility.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight">{facility.name}<br /><span className="text-2xl font-medium text-white/80">{facility.subtitle}</span></h1>
              <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
                {facility.description}
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-5xl hover:bg-teal-50 transition-all flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined">description</span>
                Asset Whitepaper
              </button>
            </div>
          </div>
        </section>

        {/* Investment Metrics Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Annual Yield</span>
              <span className="material-symbols-outlined text-tertiary">trending_up</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.annualYield}</span>
              <p className="text-tertiary text-xs font-bold mt-1">{facility.annualYieldDelta}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Occupancy Rate</span>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.occupancyRate}%</span>
              <div className="w-full bg-surface-container h-2 rounded-5xl mt-3">
                <div className="bg-primary h-2 rounded-5xl" style={{ width: `${facility.occupancyRate}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Total Capacity</span>
              <span className="material-symbols-outlined text-on-surface-variant">bed</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.totalCapacity}</span>
              <p className="text-on-surface-variant/60 text-xs mt-1">{facility.remainingUnits} units remaining</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary-container p-6 rounded-3xl shadow-lg flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-secondary-fixed">Burn Multiplier</span>
              <span className="material-symbols-outlined text-secondary-fixed">local_fire_department</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold font-headline">1.5x</span>
              <p className="text-secondary-fixed/80 text-xs font-medium mt-1">$CARE Staking Boost Active</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Facility Overview & Bed Inventory */}
          <div className="lg:col-span-2 space-y-8">
            {/* Facility Overview */}
            <div className="bg-surface-container-low rounded-3xl p-8">
              <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Facility Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-on-surface-variant leading-relaxed">
                    {facility.overviewText}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">medical_services</span>
                      Clinical Support (24/7 ICU linkage)
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">nutrition</span>
                      Customized Nutritional Plans
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">psychology</span>
                      Professional Memory Care Units
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img className="rounded-2xl h-32 w-full object-cover shadow-sm" src={facility.overviewImages[0]} alt="Facility interior" />
                  <img className="rounded-2xl h-32 w-full object-cover shadow-sm" src={facility.overviewImages[1]} alt="Facility exterior" />
                </div>
              </div>
            </div>

            {/* Bed Inventory */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-extrabold font-headline text-on-surface">Bed Asset List</h2>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">NFT Minting in Progress</span>
              </div>
              <div className="space-y-4">
                {/* Standard Care Unit */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-primary text-3xl">single_bed</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Standard Care Unit</h4>
                      <p className="text-sm text-on-surface-variant">Single bed, private bath, smart health monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="min-w-[3rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Yield</p>
                      <p className="text-tertiary font-bold">7.8%</p>
                    </div>
                    <div className="min-w-[6.5rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Price</p>
                      <p className="text-on-surface font-extrabold whitespace-nowrap">25,000 USDC</p>
                    </div>
                    <button onClick={() => setIsBuyNftOpen(true)} className="w-28 py-3 bg-primary text-white font-bold rounded-5xl active:scale-95 transition-transform whitespace-nowrap">Buy NFT</button>
                  </div>
                </div>

                {/* Issue 3: Deluxe Garden Suite */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-primary text-3xl">king_bed</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Deluxe Garden Suite</h4>
                      <p className="text-sm text-on-surface-variant">Double room, terrace, concierge service</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="min-w-[3rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Yield</p>
                      <p className="text-tertiary font-bold">8.5%</p>
                    </div>
                    <div className="min-w-[6.5rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Price</p>
                      <p className="text-on-surface font-extrabold whitespace-nowrap">42,000 USDC</p>
                    </div>
                    <button onClick={() => setIsBuyNftOpen(true)} className="w-28 py-3 bg-primary text-white font-bold rounded-5xl active:scale-95 transition-transform whitespace-nowrap">Buy NFT</button>
                  </div>
                </div>

                {/* Memory Care Center */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group border-l-4 border-secondary">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">Memory Care Center</h4>
                        <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded uppercase">Rare</span>
                      </div>
                      <p className="text-sm text-on-surface-variant">Professional integrated cognitive care zone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="min-w-[3rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Yield</p>
                      <p className="text-tertiary font-bold">11.2%</p>
                    </div>
                    <div className="min-w-[6.5rem]">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Price</p>
                      <p className="text-on-surface font-extrabold whitespace-nowrap">55,000 USDC</p>
                    </div>
                    <button onClick={() => setIsBuyNftOpen(true)} className="w-28 py-3 bg-secondary text-white font-bold rounded-5xl active:scale-95 transition-transform whitespace-nowrap">Buy NFT</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Queue Status & Compliance */}
          <div className="space-y-8">
            {/* Queue Status */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold font-headline text-lg">Queue Status</h3>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-5xl bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-5xl h-3 w-3 bg-secondary" />
                </span>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-error">VIP: Emergency Placement</span>
                    <span>~12 Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-error h-3 rounded-5xl" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-secondary">Fast Track: Priority Access</span>
                    <span>~45 Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-secondary h-3 rounded-5xl" style={{ width: '60%' }} />
                  </div>
                </div>
                {/* Issue 2: Standard 进度条 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-on-surface-variant">Standard: General Waitlist</span>
                    <span>~180 Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-outline h-3 rounded-5xl" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAdmissionOpen(true)} className="w-full mt-8 py-3 border-2 border-primary text-primary font-bold rounded-5xl hover:bg-primary hover:text-white transition-all active:scale-95">
                Apply for Admission
              </button>
            </div>

            {/* Transparency Protocols */}
            <div className="bg-surface-container-low p-8 rounded-3xl">
              <h3 className="font-extrabold font-headline text-lg mb-6">Transparency Protocols</h3>
              <div className="space-y-4">
                {/* Latest Audit */}
                <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Latest Audit</p>
                    <a className="text-xs text-primary underline" href="#">2023 Q3 Compliance Report</a>
                  </div>
                </div>
                {/* Issue 4: Pyth Price Feed */}
                <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-tertiary/10 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-tertiary">price_change</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Pyth Price Feed</p>
                    <p className="text-xs text-on-surface-variant">
                      <span className="font-mono text-[10px]">0x4a…3d9b</span>
                      <span className="ml-2 text-tertiary font-semibold">Real-time data</span>
                    </p>
                  </div>
                </div>
                {/* Issue 4: RWA Trust Deed */}
                <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-secondary/10 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary">account_balance</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">RWA Trust Deed</p>
                    <a className="text-xs text-primary underline" href="#">View Custody Documents</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
      <BuyNftDialog isOpen={isBuyNftOpen} onClose={() => setIsBuyNftOpen(false)} />
      <QueueAdmissionDialog isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />
    </>
  )
}
