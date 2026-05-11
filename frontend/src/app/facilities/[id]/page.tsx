'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getFacilityAssetsQuery,
  getFacilityQuery,
  getFacilityQueueStatusQuery,
} from '@/apis/facilities/queries'
import type { FacilityAssetVO } from '@/apis/facilities/types'
import { BuyNftDialog, QueueAdmissionDialog } from '@/components/dialogs'
import { AppFooter } from '@/components/layout/app-footer'

const overviewGallery = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB98CMKw-lByzcpfhiGgsYZC0Ieg61sytysXuQnZ4BX6bJ4DAQxVnToeRqX_qcCnmMevKpjaeoq605wGrBTckDT3DseADx_OmS-aduSmHFAEAq5o2Zeqvgd4olo3E00SJLdHQnR2Va76tGY-VXZHwHLAGnnjf3lWV3l-QgZjFvR78JD1H4OVxrDlKvResHAEMS-SjfmN04YhGtC2mX4BdC6dv6pRnwkDwVtcCBSaUW7MTqAPLA-4MbVQyn3ZeZi_BUTX6i6MtwvgbRE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9-cZ6AcOGNXliEGldsuCtxemdMp6MfFAYUmS8ImsZNVyilMjOqevAldW91QPXMHy4K3cBAdrrIoVIZNLQV3e7BC8lm1cWjVr3YRNHE8Myxb_46R1yZy0goU5BENHQNC93DvEGwzgzd8XwiSweLBct1wvpf2yysj7QSrSHeQdgEu3VmI9rDV0G30eoyAeUOZmLIG9PtKRXX_YnthGDV9JI_dbal8tdkBup8UfxXgC3u0nRzR-u00jtt-OK6lvPLqg9vak8eml5m6s',
]

function getSubtitle(name: string) {
  if (name.includes('Foshan')) return 'Premium Medical Care'
  if (name.includes('Guangzhou')) return 'Comprehensive Senior Care'
  if (name.includes('Shenzhen')) return 'Elite Wellness Living'
  return 'RWA Senior Care Facility'
}

function getYieldDelta(yieldValue: string) {
  const parsed = Number.parseFloat(yieldValue.replace('%', ''))
  if (Number.isNaN(parsed)) return 'Updated from backend'
  const delta = Math.max(0.2, Math.min(0.7, parsed - 7.1))
  return `+${delta.toFixed(1)}% from current pricing band`
}

function getRemainingUnits(totalBeds: number, occupancy: number) {
  return Math.max(0, Math.round(totalBeds * (100 - occupancy) / 100))
}

function getAssetDescription(asset: FacilityAssetVO) {
  const assetType = asset.type.toLowerCase()
  if (assetType.includes('luxury') || assetType.includes('suite')) {
    return 'Private suite, upgraded care services, premium wellness package'
  }
  if (assetType.includes('memory')) {
    return 'Professional integrated cognitive care zone'
  }
  return 'Single bed, private bath, smart health monitoring'
}

function getAssetIcon(asset: FacilityAssetVO) {
  const assetType = asset.type.toLowerCase()
  if (assetType.includes('luxury') || assetType.includes('suite')) return 'king_bed'
  if (assetType.includes('memory')) return 'psychology'
  return 'single_bed'
}

function getAssetAccent(asset: FacilityAssetVO) {
  const assetType = asset.type.toLowerCase()
  if (assetType.includes('memory')) {
    return {
      buttonClass: 'bg-secondary text-white',
      iconClass: 'text-secondary',
      highlightClass: 'border-l-4 border-secondary',
      badge: 'Rare',
    }
  }

  return {
    buttonClass: 'bg-primary text-white',
    iconClass: 'text-primary',
    highlightClass: '',
    badge: null as string | null,
  }
}

function getQueueProgress(waitDays: number, maxDays: number) {
  const ratio = Math.min(100, Math.max(10, Math.round((waitDays / maxDays) * 100)))
  return `${ratio}%`
}

export default function FacilityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isBuyNftOpen, setIsBuyNftOpen] = useState(false)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)

  const facilityQuery = useQuery(getFacilityQuery(id))
  const assetsQuery = useQuery(getFacilityAssetsQuery(id))
  const queueStatusQuery = useQuery(getFacilityQueueStatusQuery(id))

  const facility = facilityQuery.data?.data
  const assets = assetsQuery.data?.data ?? []
  const queueStatus = queueStatusQuery.data?.data

  const isLoading = facilityQuery.isLoading || assetsQuery.isLoading || queueStatusQuery.isLoading
  const isError = facilityQuery.isError || assetsQuery.isError || queueStatusQuery.isError
  const errorMessage = [
    facilityQuery.error,
    assetsQuery.error,
    queueStatusQuery.error,
  ].find(Boolean) instanceof Error
    ? ([facilityQuery.error, assetsQuery.error, queueStatusQuery.error].find(Boolean) as Error).message
    : 'Unknown error'

  if (isLoading) {
    return (
      <>
        <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-surface-container-low rounded-3xl border border-outline-variant p-10 text-center">
            <p className="text-sm text-on-surface-variant">Loading facility details from backend...</p>
          </div>
        </div>
        <AppFooter />
      </>
    )
  }

  if (isError || !facility || !queueStatus) {
    return (
      <>
        <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-surface-container-low rounded-3xl border border-red-200 p-10 text-center">
            <p className="text-sm text-on-surface mb-4">
              Failed to load facility details: {errorMessage}
            </p>
            <button
              onClick={() => {
                facilityQuery.refetch()
                assetsQuery.refetch()
                queueStatusQuery.refetch()
              }}
              className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
        <AppFooter />
      </>
    )
  }

  const subtitle = getSubtitle(facility.name)
  const annualYieldDelta = getYieldDelta(facility.yield)
  const remainingUnits = getRemainingUnits(facility.totalBeds, facility.occupancy)
  const queueMaxDays = Math.max(queueStatus.p1WaitDays, queueStatus.p2WaitDays, queueStatus.p3WaitDays, 1)

  return (
    <>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
        <section className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl group">
          <Link href="/facilities" className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-5xl transition-all shadow-lg active:scale-95 group/back" title="Back to facilities list">
            <span className="material-symbols-outlined transition-transform group-hover/back:-translate-x-1">arrow_back</span>
          </Link>
          <img alt={facility.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={facility.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {(facility.badges.length > 0 ? facility.badges : [{ label: 'Active Asset', variant: 'default' as const }]).map(badge => (
                  <span key={badge.label} className="px-3 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-100 text-xs font-bold rounded-5xl uppercase tracking-wider">
                    {badge.label}
                  </span>
                ))}
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-5xl flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span> {facility.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white font-headline leading-tight">{facility.name}<br /><span className="text-2xl font-medium text-white/80">{subtitle}</span></h1>
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

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Annual Yield</span>
              <span className="material-symbols-outlined text-tertiary">trending_up</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.yield}</span>
              <p className="text-tertiary text-xs font-bold mt-1">{annualYieldDelta}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Occupancy Rate</span>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.occupancy}%</span>
              <div className="w-full bg-surface-container h-2 rounded-5xl mt-3">
                <div className="bg-primary h-2 rounded-5xl" style={{ width: `${facility.occupancy}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-semibold text-sm">Total Capacity</span>
              <span className="material-symbols-outlined text-on-surface-variant">bed</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface font-headline">{facility.totalBeds}</span>
              <p className="text-on-surface-variant/60 text-xs mt-1">{remainingUnits} units remaining</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary-container p-6 rounded-3xl shadow-lg flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-secondary-fixed">Queue Boost</span>
              <span className="material-symbols-outlined text-secondary-fixed">local_fire_department</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold font-headline">{facility.queueBoost}</span>
              <p className="text-secondary-fixed/80 text-xs font-medium mt-1">Live boost config from backend</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-container-low rounded-3xl p-8">
              <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Facility Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-on-surface-variant leading-relaxed">
                    {facility.description}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">medical_services</span>
                      Clinical Support with linked emergency care
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">nutrition</span>
                      Customized nutritional and wellness planning
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-primary-container">
                      <span className="material-symbols-outlined text-xl">psychology</span>
                      Memory care and long-term rehabilitation support
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img className="rounded-2xl h-32 w-full object-cover shadow-sm" src={overviewGallery[0]} alt="Facility interior" />
                  <img className="rounded-2xl h-32 w-full object-cover shadow-sm" src={overviewGallery[1]} alt="Facility exterior" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-extrabold font-headline text-on-surface">Bed Asset List</h2>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Backend Synced</span>
              </div>
              <div className="space-y-4">
                {assets.map(asset => {
                  const accent = getAssetAccent(asset)

                  return (
                    <div
                      key={asset.serial}
                      className={`bg-surface-container-lowest p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group ${accent.highlightClass}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <span className={`material-symbols-outlined text-3xl ${accent.iconClass}`}>{getAssetIcon(asset)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{asset.type}</h4>
                            {accent.badge && (
                              <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded uppercase">
                                {accent.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-on-surface-variant">{getAssetDescription(asset)}</p>
                          <p className="text-xs text-outline mt-1">{asset.serial} · {asset.mode} · {asset.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right flex-shrink-0">
                        <div className="min-w-[3rem]">
                          <p className="text-xs font-bold text-on-surface-variant uppercase">Yield</p>
                          <p className="text-tertiary font-bold">{asset.yield || '--'}</p>
                        </div>
                        <div className="min-w-[6.5rem]">
                          <p className="text-xs font-bold text-on-surface-variant uppercase">Price</p>
                          <p className="text-on-surface font-extrabold whitespace-nowrap">{asset.buyPrice || 'TBD'}</p>
                        </div>
                        <button onClick={() => setIsBuyNftOpen(true)} className={`w-28 py-3 font-bold rounded-5xl active:scale-95 transition-transform whitespace-nowrap ${accent.buttonClass}`}>
                          Buy NFT
                        </button>
                      </div>
                    </div>
                  )
                })}

                {assets.length === 0 && (
                  <div className="bg-surface-container-lowest p-6 rounded-3xl text-center text-sm text-on-surface-variant">
                    No bed assets returned by backend.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
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
                    <span>~{queueStatus.p1WaitDays} Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-error h-3 rounded-5xl" style={{ width: getQueueProgress(queueStatus.p1WaitDays, queueMaxDays) }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-secondary">Fast Track: Priority Access</span>
                    <span>~{queueStatus.p2WaitDays} Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-secondary h-3 rounded-5xl" style={{ width: getQueueProgress(queueStatus.p2WaitDays, queueMaxDays) }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-on-surface-variant">Standard: General Waitlist</span>
                    <span>~{queueStatus.p3WaitDays} Days Wait</span>
                  </div>
                  <div className="w-full bg-surface-container h-3 rounded-5xl">
                    <div className="bg-outline h-3 rounded-5xl" style={{ width: getQueueProgress(queueStatus.p3WaitDays, queueMaxDays) }} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-outline mt-4">
                Updated from backend: {new Date(queueStatus.updatedAt).toLocaleString()}
              </p>
              <button onClick={() => setIsAdmissionOpen(true)} className="w-full mt-8 py-3 border-2 border-primary text-primary font-bold rounded-5xl hover:bg-primary hover:text-white transition-all active:scale-95">
                Apply for Admission
              </button>
            </div>

            <div className="bg-surface-container-low p-8 rounded-3xl">
              <h3 className="font-extrabold font-headline text-lg mb-6">Transparency Protocols</h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Latest Audit</p>
                    <a className="text-xs text-primary underline" href="#">2023 Q3 Compliance Report</a>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-tertiary/10 rounded-xl flex-shrink-0">
                    <span className="material-symbols-outlined text-tertiary">price_change</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Queue Configuration</p>
                    <p className="text-xs text-on-surface-variant">
                      <span className="font-mono text-[10px]">{facility.id}</span>
                      <span className="ml-2 text-tertiary font-semibold">Backend synced</span>
                    </p>
                  </div>
                </div>
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
