'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AssetManagementModal } from '@/components/modals'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'

const assets = [
  {
    serial: 'FSH-A301',
    location: 'Foshan, China',
    yield: '7.2%',
    buyPrice: '$4,500 USDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn1zUu4fxDftEO-CtwHgHB0SHRDMwvZ-LEwrCrb8FWuGfo21XBJRSTjwO1zao0VE2cBjVh6Vr-DHAB7NmC2m7UGi102HVKZK7T8EuJoUuIhdrJllPdBxgmywrtVBhueshEVCglsNtJwpwgY1NQT6-gTtGqi-vRb4qDCTXcq11QLmKtiGzaMu8Cp1zbkIThTDhx0TbzD88RsBrZQLvG7HJ6-I4fAIX6zyST6MDuLVubV3t59--ft1kh4-whvrp8b27eQ7ipfbSCPz1X',
    type: 'Standard Bed',
    mode: 'Yield Mode',
  },
  {
    serial: 'GZ-B102',
    location: 'Guangzhou, China',
    yield: '6.8%',
    buyPrice: '$8,000 USDC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBExhzYyOhm_5rK0qBX-e09yWbj8J6FViJjuBn5NBeMPmv83Gzz9hTMCGZMcz96YHyRx22UO4tCeJBjZSrLOSVqkSoIx1f54Pb82M5rY_uZwZU13nBf4G-o9MBmsjJ6HL1roiJDyarkftqOFT0Q-UI_aJGuqFVkGEtah2jj-8siJ-0nSC2RNUrEfFGrXPv-8Zpc_HdfedjpY7mEi9VJy4zaDiP8qVnzVKQDgjusr4PoxT2TZ0XmiEsClgZV13rluC0hGQOck9150M87',
    type: 'Luxury Suite',
    mode: 'Residence Mode',
  },
  {
    serial: 'SZ-C505',
    location: 'Shenzhen, China',
    yield: '8.1%',
    buyPrice: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBomKHUA3qIO35Pv5TmRdP9U4NIAAKww1WolBdbshDKV8K8H3JDAzlAut11jMims6Pfw7AqYLv0LCMLnskeJkmz-y_i2eBwfKo8oMKrTRLaFMwZggfKDV98nnvTq2a91hAgh6RmtC6uh147BQ8AoZtLX3CYMuOH1HSnksimOUQytrQEG--LJawl23pWBajVFLgQsBxd-61umkprVnFifDEXjp2AShbytm9BDRg6q6vFTd8x0t3dkJXD5Ppf8F-tf0Xd93hA9uZ73Pu8',
    type: 'Standard Bed',
    mode: 'Yield Mode',
  },
]

export default function AssetManagementPage() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)

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
              <h2 className="text-5xl font-extrabold text-primary font-headline">3</h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">inventory_2</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total Value</p>
              <h2 className="text-4xl font-extrabold text-on-surface font-headline">22,500 <span className="text-xl font-medium text-on-surface-variant">USDC</span></h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-tertiary relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Accrued Yield</p>
              <h2 className="text-4xl font-extrabold text-tertiary font-headline">1,240 <span className="text-xl font-medium text-tertiary">USDC</span></h2>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <span className="material-symbols-outlined text-[120px]">trending_up</span>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assets.map(asset => (
            <div key={asset.serial} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row border border-surface-container-high">
              <div className="sm:w-1/3 relative h-48 sm:h-auto">
                <img alt={asset.serial} className="w-full h-full object-cover" src={asset.image} />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-5xl text-xs font-bold text-primary shadow-sm tracking-wider">
                  {asset.serial === 'FSH-A301' ? 'ACTIVE' : asset.serial === 'GZ-B102' ? 'ON-CHAIN' : 'PENDING'}
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
                  <Button onClick={() => setIsAssetModalOpen(true)} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-transform shadow-sm flex justify-center items-center gap-2">
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
              <p className="text-xs text-on-surface-variant/70 max-w-xl">All assets are secured on-chain. Medical service quality is audited quarterly by independent third-party institutions.</p>
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

      <AssetManagementModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
    </>
  )
}
