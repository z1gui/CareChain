export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight mb-6">CareChain</h2>
          <p className="max-w-md opacity-70 mb-8 leading-relaxed">
            CareChain is dedicated to reshaping the ownership and operation of elderly care assets via Web3 technology. We are not just a DeFi protocol; we are the digital guardians of sovereign healthcare assets.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="material-symbols-outlined text-sm">language</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="material-symbols-outlined text-sm">hub</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>
          </div>
        </div>
        <div>
          <h5 className="font-bold mb-6">Quick Links</h5>
          <ul className="space-y-4 text-sm opacity-70">
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Asset Dashboard</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Priority Queue Status</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Burn History</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Developer API</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6">Compliance & Support</h5>
          <ul className="space-y-4 text-sm opacity-70">
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Legal Disclaimer</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Security Audits</a></li>
            <li><a className="hover:text-primary-fixed transition-colors" href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-xs opacity-50">
        © 2024 CareChain Foundation. Built on Solana for a brighter aging future.
      </div>
    </footer>
  )
}
