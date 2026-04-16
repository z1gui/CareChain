import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden py-24">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-10 blur-sm"
              alt="Modern clinical interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWMXGeIK3bpH70e8bSnOIR-W_niESOuG_CcD5kC75EHkP3JdoQrxwwwwl91sxdbZnfmvQd-fH18P8psp4DRUTYCUZqQrqIEIxWcWd4s4jG3f9bIVIJcDVuU317u7RZmOb2eoiqvVDeP9FYsNVHO3hITxdbsj32MEHhL9QYct7vTnsHIP095kW0RG382SLYMDZKF5UIgqCVmIhZxBJQMBWoCXNgqOdaQKou82JF14k4P_UUqJ8nhL29qPff59XO774OCK1vQXovraqi"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold mb-6 tracking-widest uppercase">
              Solana Ecosystem Pioneer
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-on-surface leading-tight mb-8 tracking-tighter">
              The <span className="text-primary italic">Sovereign</span><br />Sanctuary.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-on-surface-variant font-light mb-12 leading-relaxed">
              Transforming traditional healthcare assets into liquid RWA. We bridge clinical precision with decentralized finance to build a transparent, sovereign, and efficient future for an aging society.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/facilities" className="bg-gradient-to-br from-[#006a31] to-[#008378] text-on-primary px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                Get Started
              </Link>
              <button className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-10 py-4 rounded-full text-lg font-bold hover:bg-surface-container-low transition-colors">
                View Whitepaper
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-10 rounded-full flex flex-col justify-center items-center text-center shadow-sm">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mb-2">Tokenized Beds</span>
                <h3 className="text-5xl font-extrabold text-primary">200+</h3>
                <p className="text-sm text-tertiary mt-2">Across 5 Top Clinical Facilities</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-full flex flex-col justify-center items-center text-center shadow-sm">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mb-2">Total Value Locked (TVL)</span>
                <h3 className="text-5xl font-extrabold text-primary">$12.5M</h3>
                <p className="text-sm text-secondary mt-2">Verified Live on Solana</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-full flex flex-col justify-center items-center text-center shadow-sm">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mb-2">Target APY</span>
                <h3 className="text-5xl font-extrabold text-tertiary">7.2%-9.0%</h3>
                <p className="text-sm text-on-surface-variant mt-2">Backed by Real Estate Yields</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission: RWA for Elderly Care */}
        <section className="py-32 bg-surface">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-on-surface mb-8">Perfect Integration of RWA & Healthcare</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container">apartment</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Bed Tokenization</h4>
                    <p className="text-on-surface-variant leading-relaxed">By tokenizing individual care beds as NFT/Tokens, we lower the entry barrier for massive real estate investments, enabling fractional ownership.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-container">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Full-Chain Transparency</h4>
                    <p className="text-on-surface-variant leading-relaxed">Occupancy rates, financial yields, and operational status are uploaded to Solana via oracles, eliminating dark box operations in traditional investing.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">currency_exchange</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Instant Liquidity</h4>
                    <p className="text-on-surface-variant leading-relaxed">Unlike traditional real estate with multi-year exit cycles, CareChain investors can trade their asset shares anytime on secondary markets.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-surface-container-high flex items-center justify-center p-4">
                <img
                  alt="Medical robotic arm"
                  className="w-full h-full object-cover rounded-full shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8oQt5j3VdVjnfTrRvV1X54aW_a5TlqEocKce0QIW0Br8sVb6mOic2W1JL4JT4sZ9yP4jLx5S7FlNbZY36j_E4wvUbXOu5QeDqy5XsfIvsXX1PLeT5ELREvGU3Pbhcv4fq6UmLKatF9l2yxeiesbepbTGvFzQ7Ejn54m6AjdcuLH173sZbXWTsrHEymwATNLqVg7XYDCUbYg4HCPcBPsxWDNfxMtLmgsSIbiYbIvqjxzlV5qzN0tn5aVbBLUzZHME3kbPrdxXAn7W"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-xl shadow-xl border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-tertiary" />
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
                <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold">Highest Priority</div>
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
              <div className="flex-shrink-0 flex items-center justify-center bg-white/10 w-32 h-32 rounded-full border-4 border-dashed border-white/30">
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
                <div className="relative bg-surface p-6 rounded-xl border border-outline-variant/10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mb-6 relative z-10 mx-auto md:mx-0">1</div>
                  <h5 className="font-bold mb-2">Asset Intake</h5>
                  <p className="text-xs text-on-surface-variant">Evaluate and complete legal compliance and asset audits for physical nursing homes.</p>
                </div>
                <div className="relative bg-surface p-6 rounded-xl border border-outline-variant/10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mb-6 relative z-10 mx-auto md:mx-0">2</div>
                  <h5 className="font-bold mb-2">On-chain Tokenization</h5>
                  <p className="text-xs text-on-surface-variant">Generate corresponding RWA tokens and launch initial liquidity pools.</p>
                </div>
                <div className="relative bg-surface p-6 rounded-xl border border-outline-variant/10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mb-6 relative z-10 mx-auto md:mx-0">3</div>
                  <h5 className="font-bold mb-2">Yield Distribution</h5>
                  <p className="text-xs text-on-surface-variant">Monthly rental income is converted to USDC/CARE and auto-distributed to wallets.</p>
                </div>
                <div className="relative bg-surface p-6 rounded-xl border border-outline-variant/10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mb-6 relative z-10 mx-auto md:mx-0">4</div>
                  <h5 className="font-bold mb-2">Ecosystem Expansion</h5>
                  <p className="text-xs text-on-surface-variant">Introduce bidding from care service providers to further boost underlying asset yields.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-24 bg-surface-container-highest">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-12">Trusted by Leading Institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
                <span className="font-headline font-bold text-xl">Clinica Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">token</span>
                <span className="font-headline font-bold text-xl">Solana Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">assured_workload</span>
                <span className="font-headline font-bold text-xl">Global Health Fund</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">security</span>
                <span className="font-headline font-bold text-xl">CertiK Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
                <span className="font-headline font-bold text-xl">Heritage Trust</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
