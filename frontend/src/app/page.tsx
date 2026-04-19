import AppFooter from '@/components/layout/app-footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { PartnersSection } from '@/components/sections/PartnersSection'
import { StatsGrid } from '@/components/sections/StatsGrid'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { TimelineStep } from '@/components/shared/TimelineStep'

const stats = [
  { label: 'Tokenized Beds', value: '200+', description: 'Across 5 Top Clinical Facilities' },
  { label: 'Total Value Locked (TVL)', value: '$12.5M', description: 'Verified Live on Solana' },
  { label: 'Target APY', value: '7.2%-9.0%', description: 'Backed by Real Estate Yields' },
]

const partners = [
  { icon: 'medical_services', name: 'Clinica Partners' },
  { icon: 'token', name: 'Solana Labs' },
  { icon: 'assured_workload', name: 'Global Health Fund' },
  { icon: 'security', name: 'CertiK Verified' },
  { icon: 'account_balance', name: 'Heritage Trust' },
]

const roadmapSteps = [
  { step: 1, title: 'Asset Intake', description: 'Evaluate and complete legal compliance and asset audits for physical nursing homes.' },
  { step: 2, title: 'On-chain Tokenization', description: 'Generate corresponding RWA tokens and launch initial liquidity pools.' },
  { step: 3, title: 'Yield Distribution', description: 'Monthly rental income is converted to USDC/CARE and auto-distributed to wallets.' },
  { step: 4, title: 'Ecosystem Expansion', description: 'Introduce bidding from care service providers to further boost underlying asset yields.' },
]

export default function Home() {
  return (
    <>
      <div className="pt-16">
        <HeroSection
          badge="Solana Ecosystem Pioneer"
          titleLine1="The"
          titleHighlight="Sovereign"
          titleLine2="Sanctuary."
          description="Transforming traditional healthcare assets into liquid RWA. We bridge clinical precision with decentralized finance to build a transparent, sovereign, and efficient future for an aging society."
          primaryCta={{ text: 'Get Started', href: '/facilities' }}
          secondaryCta={{ text: 'View Whitepaper' }}
          backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDWMXGeIK3bpH70e8bSnOIR-W_niESOuG_CcD5kC75EHkP3JdoQrxwwwwl91sxdbZnfmvQd-fH18P8psp4DRUTYCUZqQrqIEIxWcWd4s4jG3f9bIVIJcDVuU317u7RZmOb2eoiqvVDeP9FYsNVHO3hITxdbsj32MEHhL9QYct7vTnsHIP095kW0RG382SLYMDZKF5UIgqCVmIhZxBJQMBWoCXNgqOdaQKou82JF14k4P_UUqJ8nhL29qPff59XO774OCK1vQXovraqi"
        />

        <StatsGrid stats={stats} />

        {/* Mission: RWA for Elderly Care */}
        <section className="py-32 bg-surface">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-on-surface mb-8">Perfect Integration of RWA & Healthcare</h2>
              <div className="space-y-8">
                <FeatureItem
                  icon="apartment"
                  title="Bed Tokenization"
                  description="By tokenizing individual care beds as NFT/Tokens, we lower the entry barrier for massive real estate investments, enabling fractional ownership."
                />
                <FeatureItem
                  icon="verified"
                  title="Full-Chain Transparency"
                  description="Occupancy rates, financial yields, and operational status are uploaded to Solana via oracles, eliminating dark box operations in traditional investing."
                  iconBgColor="bg-tertiary-container"
                  iconTextColor="text-on-tertiary-container"
                />
                <FeatureItem
                  icon="currency_exchange"
                  title="Instant Liquidity"
                  description="Unlike traditional real estate with multi-year exit cycles, CareChain investors can trade their asset shares anytime on secondary markets."
                  iconBgColor="bg-secondary-container"
                  iconTextColor="text-on-secondary-container"
                />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-5xl bg-surface-container-high flex items-center justify-center p-4">
                <img
                  alt="Medical robotic arm"
                  className="w-full h-full object-cover shadow-2xl rounded-5xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8oQt5j3VdVjnfTrRvV1X54aW_a5TlqEocKce0QIW0Br8sVb6mOic2W1JL4JT4sZ9yP4jLx5S7FlNbZY36j_E4wvUbXOu5QeDqy5XsfIvsXX1PLeT5ELREvGU3Pbhcv4fq6UmLKatF9l2yxeiesbepbTGvFzQ7Ejn54m6AjdcuLH173sZbXWTsrHEymwATNLqVg7XYDCUbYg4HCPcBPsxWDNfxMtLmgsSIbiYbIvqjxzlV5qzN0tn5aVbBLUzZHME3kbPrdxXAn7W"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-xl shadow-xl border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-5xl bg-tertiary" />
                  <span className="text-sm font-bold">100% Clinical Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mechanism: Priority Queue */}
        <section className="py-32 bg-surface-container-low overflow-hidden">
          <div className="container mx-auto px-6 text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Three-Tier Priority Queue & Burn Mechanism</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">CareChain&apos;s unique $CARE governance token model ensures long-term ecosystem sustainability and investor tier protection.</p>
          </div>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-secondary relative">
                <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-1 rounded-5xl text-xs font-bold">Highest Priority</div>
                <h4 className="text-2xl font-bold mb-4">P1: Strategic Queue</h4>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">For governance participants with large $CARE holdings and long-term locks. Enjoys priority residency rights and maximum yield weight.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-base">check_circle</span> 0 Days Wait Period</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-base">check_circle</span> 9.0% Target APY</li>
                </ul>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-primary">
                <h4 className="text-2xl font-bold mb-4">P2: Active Queue</h4>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">For investors who regularly interact with the ecosystem and hold moderate assets. Balanced liquidity and returns.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-primary text-base">check_circle</span> Standard Wait Period</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-primary text-base">check_circle</span> 8.1% Target APY</li>
                </ul>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-outline-variant">
                <h4 className="text-2xl font-bold mb-4">P3: Standard Queue</h4>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">For retail investors. Lowest entry barrier, providing stable RWA yields without additional locking requirements.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-slate-400 text-base">check_circle</span> Flexible Exit</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-slate-400 text-base">check_circle</span> 7.2% Target APY</li>
                </ul>
              </div>
            </div>
            <div className="mt-16 bg-primary-container p-12 rounded-xl text-on-primary-container flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h4 className="text-3xl font-bold mb-4">$CARE Burn Mechanism</h4>
                <p className="text-lg opacity-90">15% of all healthcare facility operating profits will be used to buy back $CARE on the open market and burn it permanently. As occupancy rises, scarcity increases automatically via smart contracts.</p>
              </div>
              <div className="shrink-0 flex items-center justify-center bg-white/10 w-32 h-32 rounded-5xl border-4 border-dashed border-white/30">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investor Yield Roadmap */}
        <section className="py-32 bg-surface">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Investor Yield Roadmap</h2>
                <p className="text-on-surface-variant">From asset acquisition to operational maturity, every phase is clearly presented.</p>
              </div>
              <div className="mt-8 md:mt-0">
                <span className="text-xs bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-lg font-bold">2024 Q4 Roadmap</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high hidden md:block -translate-y-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {roadmapSteps.map(s => (
                  <TimelineStep key={s.step} step={s.step} title={s.title} description={s.description} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <PartnersSection partners={partners} />
      </div>
      <AppFooter />
    </>
  )
}
