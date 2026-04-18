import Link from 'next/link'
import AppFooter from '@/components/layout/app-footer'

export default function BuyCarePage() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col pt-16">
      <main className="flex-grow pt-16 pb-20 px-4 flex flex-col items-center">
        {/* Purchase Container */}
        <div className="w-full max-w-[480px] space-y-6 relative">
          {/* Back Button */}
          <div className="absolute -left-16 top-0 hidden lg:block">
            <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-md border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-white/60 transition-all shadow-sm active:scale-90">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </Link>
          </div>

          {/* Wallet Address Header (Subtle) */}
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-xs font-medium text-on-surface-variant font-label">Wallet: 0x71C...4e21</span>
            </div>
            <span className="text-xs font-bold text-primary font-label">Balance: 12.45 SOL</span>
          </div>

          {/* Swap Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-6 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-extrabold font-headline text-teal-900">Buy $CARE</h1>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:rotate-180 transition-transform duration-500">autorenew</span>
            </div>

            {/* From Section */}
            <div className="bg-surface-container-low p-4 rounded-xl mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase font-label">Pay</span>
                <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Max</span>
              </div>
              <div className="flex justify-between items-center">
                <input readOnly className="bg-transparent border-none focus:ring-0 text-2xl font-headline font-bold text-on-surface w-full p-0" placeholder="0.00" type="number" defaultValue="1.0" />
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img alt="Solana logo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwp6KKz1Z7t9js7UJ1Hujt29edFHmaIUfrMRQVSCjp95qWqbefM3L_Z8cZAOrCr_HUQT4H18jUUDbVLgyct1-3rdbT94qcsZYVTzFCnVA4_xQ_mDBD4B0GEE50htlFiCMhtNTHaRB5MKqkx0YHQ7BrwDsVk6nHSsarmLZ4rEawztQiOLyD2lcIg5PS9ttsGleAxtWIsH8tmILSTfmhZYHihKRi3y8DSUS3m9vW69_pIBPer4UI0nRQbl3vah8zKkMtEkLeJz1n75k" />
                  </div>
                  <span className="font-bold text-sm font-headline">SOL</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center -my-4 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-md border border-outline-variant/10 text-primary">
                <span className="material-symbols-outlined">arrow_downward</span>
              </div>
            </div>

            {/* To Section */}
            <div className="bg-surface-container-low p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase font-label">Receive</span>
                <span className="text-xs font-medium text-on-surface-variant">Estimated</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-headline font-bold text-teal-800">12,450.00</span>
                <div className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>health_and_safety</span>
                  </div>
                  <span className="font-bold text-sm font-headline">CARE</span>
                </div>
              </div>
            </div>

            {/* Exchange Info */}
            <div className="space-y-2 mb-6 px-1">
              <div className="flex justify-between text-xs font-medium font-label">
                <span className="text-on-surface-variant">Rate</span>
                <span className="text-on-surface font-bold">1 SOL ≈ 12,450 CARE</span>
              </div>
              <div className="flex justify-between text-xs font-medium font-label">
                <span className="text-on-surface-variant">Slippage Limit</span>
                <span className="text-on-surface font-bold">0.5%</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-headline font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">swap_calls</span>
              Buy $CARE Now
            </button>
          </div>

          {/* Utility Bento Section */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {/* Priority Queue Card */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-secondary shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <span className="material-symbols-outlined text-lg">priority_high</span>
                <h3 className="text-sm font-bold font-headline">Priority Queue</h3>
              </div>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                Holding $CARE allows you to bypass regular queues and gain priority access to medical resources and RWA assets.
              </p>
            </div>

            {/* Burn Logic Card */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-tertiary shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-tertiary">
                <span className="material-symbols-outlined text-lg">local_fire_department</span>
                <h3 className="text-sm font-bold font-headline">Burn Mechanism</h3>
              </div>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                20% of all transaction and service fees will be permanently burned, ensuring a continuous deflation of the token supply.
              </p>
            </div>
          </div>

          {/* Protocol Badge */}
          <div className="flex flex-col items-center gap-2 mt-12 opacity-40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] font-bold tracking-widest uppercase font-label">Institutional Grade Security</span>
            </div>
            <p className="text-[10px] text-center max-w-xs font-body">
              CareChain protocol assets are backed by clinical asset packages (RWA) and strictly governed by smart contracts.
            </p>
          </div>
        </div>
      </main>

      <AppFooter />

      {/* Visual Background Element */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />
    </div>
  )
}
