'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { getFacilityAssetsQuery } from '@/apis/facilities/queries'
import { AssetManagementDialog } from '@/components/dialogs'
import { SectionHeader } from '@/components/shared/section-header'
import { Button } from '@/components/ui/button'

const DEFAULT_FACILITY_ID = 'facility_foshan'

export default function AssetManagementPage() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)
  const [selectedMint, setSelectedMint] = useState<PublicKey | undefined>(undefined)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getFacilityAssetsQuery(DEFAULT_FACILITY_ID))
  const assets = data?.data ?? []

  const totalValue = assets.reduce((sum, asset) => {
    const numericValue = Number(asset.buyPrice.replaceAll(/[^\d.]/g, '')) || 0
    return sum + numericValue
  }, 0)

  const averageApy = assets.length
    ? assets.reduce((sum, asset) => sum + (Number(asset.yield.replace('%', '')) || 0), 0) / assets.length
    : 0

  const accruedYieldEstimate = totalValue * averageApy / 100 / 12

  return (
    <>
      <main className="max-w-7xl mx-auto px-8 py-8 pt-24">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/facilities" className="w-10 h-10 rounded-5xl flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/20 shadow-sm text-on-surface-variant hover:bg-white/60 hover:text-primary transition-all group">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          </Link>
        </div>

        <SectionHeader
          title="Asset Management"
          description="Manage your BedRight NFT equity, view real-time yields, and configure elderly care priority access."
        />

        {/* Portfolio Stats - Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total NFTs</p>
              <h2 className="text-5xl font-extrabold text-primary font-headline">{assets.length}</h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">inventory_2</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total Value</p>
              <h2 className="text-4xl font-extrabold text-on-surface font-headline">{totalValue.toLocaleString()} <span className="text-xl font-medium text-on-surface-variant">USDC</span></h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-tertiary relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Accrued Yield</p>
              <h2 className="text-4xl font-extrabold text-tertiary font-headline">{Math.round(accruedYieldEstimate).toLocaleString()} <span className="text-xl font-medium text-tertiary">USDC</span></h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">trending_up</span>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading && (
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-container-high p-8 text-center">
              <p className="text-sm text-on-surface-variant">Loading facility assets from backend...</p>
            </div>
          )}

          {isError && (
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-red-200 p-8 text-center">
              <p className="text-sm text-on-surface mb-4">
                Failed to load facility assets: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          )}

          {!isLoading && !isError && assets.length === 0 && (
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-container-high p-8 text-center">
              <p className="text-sm text-on-surface-variant">No facility assets returned by backend.</p>
            </div>
          )}

          {assets.map(asset => (
            <div key={asset.serial} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row border border-surface-container-high">
              <div className="sm:w-1/3 relative h-48 sm:h-auto">
                <img alt={asset.serial} className="w-full h-full object-cover" src={asset.image} />
                <div className={`absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-5xl text-xs font-bold shadow-sm tracking-wider ${
                  asset.status === 'ON-CHAIN' ? 'text-secondary' : 'text-primary'
                }`}>
                  {asset.status}
                </div>
              </div>
              <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface tracking-tight font-headline">{asset.serial}</h3>
                      <div className="flex items-center text-on-surface-variant text-sm mt-1">
                        <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                        {asset.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-on-surface-variant uppercase">Yield</p>
                      <p className="text-lg font-extrabold text-tertiary">{asset.yield}</p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant text-sm font-medium">
                    <span className="material-symbols-outlined text-base mr-2" style={{ fontVariationSettings: '"FILL" 1' }}>{asset.mode === 'Yield Mode' ? 'payments' : 'meeting_room'}</span>
                    {asset.mode}
                  </div>
                </div>
                <div className="mt-8 flex">
                  <Button
                    onClick={() => {
                      setSelectedMint(asset.mintAddress ? new PublicKey(asset.mintAddress) : undefined)
                      setIsAssetModalOpen(true)
                    }}
                    className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-transform shadow-sm flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span> Manage Asset
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Asset Action Card */}
          <Link href="/facilities" className="bg-surface-container/50 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center p-8 cursor-pointer hover:bg-surface-container hover:border-primary/40 transition-all group block">
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">add</span>
              </div>
              <p className="font-bold text-on-surface">Subscribe New Asset</p>
              <p className="text-sm text-on-surface-variant mt-1">Browse the latest RWA Elderly Care Bed NFT projects</p>
            </div>
          </Link>
        </div>

        {/* Transparency Ledger Footer */}
        <div className="mt-20 border-t border-surface-container-highest pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1">On-Chain Transparency</h4>
              <p className="text-xs text-on-surface-variant/70 max-w-xl">Assets on this page are loaded from the backend facility assets API and can be mapped to on-chain BedRight flows later.</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Network</p>
                <p className="text-sm font-bold text-secondary">Solana Mainnet</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Audit Status</p>
                <p className="text-sm font-bold text-tertiary">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Bottom Decor */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-tertiary/30 z-50" />

      <AssetManagementDialog
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false)
          setSelectedMint(undefined)
        }}
        mintAddress={selectedMint}
      />
    </>
  )
}
