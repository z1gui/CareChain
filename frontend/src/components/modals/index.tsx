'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AssetManagementModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-950/20 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/10">
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-teal-900">BedRight NFT Management</h2>
            <p className="text-on-surface-variant font-body mt-1">Asset Serial: FSH-A301</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-5xl transition-colors">
            <span className="material-symbols-outlined text-outline">close</span>
          </button>
        </div>

        <div className="px-8 pb-10 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Asset Summary Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Location</span>
              </div>
              <p className="text-lg font-headline font-bold text-on-surface">Farrer Park, Singapore</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">bed</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Asset Type</span>
              </div>
              <p className="text-lg font-headline font-bold text-on-surface">Premium ICU Bed</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary to-primary-container rounded-xl text-white shadow-lg shadow-primary/10">
            <div>
              <p className="text-primary-fixed text-sm font-medium mb-1 opacity-90">Current APR</p>
              <p className="text-4xl font-headline font-extrabold">12.45%</p>
            </div>
            <div className="text-right">
              <p className="text-primary-fixed text-sm font-medium mb-1 opacity-90">Accrued USDC</p>
              <p className="text-3xl font-headline font-bold">$4,821.50</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">sync_alt</span>
                Operation Mode
              </label>
              <div className="flex bg-surface-container-high p-1 rounded-5xl w-fit">
                <button className="px-6 py-2 rounded-5xl text-sm font-bold transition-all bg-surface-container-lowest text-primary shadow-sm">
                  Yield
                </button>
                <button className="px-6 py-2 rounded-5xl text-sm font-bold transition-all text-outline hover:text-on-surface">
                  Stay
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-tertiary-container/10 rounded-xl border border-tertiary/10">
              <span className="material-symbols-outlined text-tertiary text-xl mt-0.5">info</span>
              <div className="text-xs leading-relaxed text-on-tertiary-fixed-variant">
                <strong>Cooling Period Info:</strong> After a mode change, a 30-day cooling period will be applied. You cannot change the status again during this time. In Yield mode, your asset is automatically added to the CareChain pool to earn steady returns.
              </div>
            </div>
          </div>

          {/* Transfer Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">send</span>
              NFT Asset Transfer
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input className="w-full bg-surface-container-high border-0 rounded-xl px-5 py-4 text-sm font-body focus:ring-2 focus:ring-primary/40 placeholder:text-outline/60" placeholder="Recipient wallet address (0x...)" type="text" />
              </div>
              <button className="bg-secondary text-on-secondary px-6 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
                Transfer Asset
              </button>
            </div>
            <p className="text-[11px] text-outline text-center">
              Transfer operations are irreversible. Please verify the recipient address carefully.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-outline hover:text-on-surface transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-8 py-2.5 bg-primary text-on-primary rounded-5xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  )
}

export function BuyNftModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-xl shadow-[0_10px_40px_-10px_rgba(0,104,95,0.04)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-8 border-b border-outline-variant/10 flex justify-between items-start">
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-2">Buy BedRight NFT</h1>
            <p className="text-on-surface-variant font-medium">Please select the asset type you wish to invest in</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-5xl transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="group relative bg-surface-container-low p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-transparent">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-surface-container-highest p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">bedroom_child</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Standard Care Unit</h3>
              <p className="text-sm text-on-surface-variant mb-6">Core Asset · Stable Occupancy</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">500 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">7.2%</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-surface-container-lowest p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-primary ring-4 ring-primary/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-3 py-1 rounded-5xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Recommended
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">spa</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Garden Suite</h3>
              <p className="text-sm text-on-surface-variant mb-6">High-Net-Worth · Premium Service</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">1,200 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">8.5%</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-surface-container-low p-6 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border-2 border-transparent">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-surface-container-highest p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div className="w-5 h-5 rounded-5xl border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface mb-1">Memory Care</h3>
              <p className="text-sm text-on-surface-variant mb-6">Rare License · High Entry Barrier</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Price</span>
                  <span className="font-headline font-bold text-primary">2,500 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">Est. APY</span>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-sm font-bold">11.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high/50 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-12 w-full md:w-auto justify-between md:justify-start">
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Est. Annual Yield</p>
                <p className="font-headline text-3xl font-extrabold text-tertiary tracking-tight">102.00 <span className="text-lg font-bold">USDC</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Total Payment</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">1,200.00</p>
                  <p className="font-bold text-on-surface-variant">USDC</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-5xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
              <span>Confirm Purchase</span>
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3 justify-center text-outline">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <p className="text-xs font-medium">All assets are regulated by Sovereign Sanctuary and audited by third parties</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CheckInPaymentModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl md:rounded-5xl md:px-8 shadow-2xl overflow-hidden ring-1 ring-on-surface/5">
        <div className="px-8 pt-8 pb-6 text-center border-b border-outline-variant/10">
          <div className="w-16 h-16 bg-primary-container/10 rounded-5xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>medical_information</span>
          </div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">Check-in & Finalize Payment</h2>
          <p className="text-on-surface-variant mt-2 text-sm">Secure your placement at the facility</p>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">bed</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Assigned Bed</p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">FSH-A301</h3>
                  <p className="text-sm text-on-surface-variant">Singapore RWA Center</p>
                </div>
                <div className="text-right flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-5xl text-xs font-medium bg-tertiary-container text-on-tertiary-container">
                    <span className="w-1.5 h-1.5 rounded-5xl bg-tertiary-fixed mr-2" />
                    Ready for Check-in
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-on-surface tracking-tight px-1">Payment Summary</h4>
            <div className="bg-surface-container-low rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Entrance Fee</span>
                <span className="font-semibold text-on-surface">2,500 USDC</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-outline-variant/20">
                <span className="font-bold text-on-surface">Total Due</span>
                <div className="text-right">
                  <span className="block text-xl font-extrabold text-primary font-headline">2,500 USDC</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Approx. 22.45 SOL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary-fixed/30 rounded-xl p-4 flex gap-3 items-start border border-secondary-container/10">
            <span className="material-symbols-outlined text-secondary text-xl mt-0.5">account_balance_wallet</span>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Notice: This payment is being transferred to the <span className="font-bold text-secondary">BedRight NFT owner</span> via smart contract for immediate occupancy rights. Verification will be processed on Solana.
            </p>
          </div>
        </div>

        <div className="px-8 pb-10 pt-4 flex flex-col gap-3">
          <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-5xl font-bold text-sm tracking-tight shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Confirm & Transfer Payment
          </button>
          <button onClick={onClose} className="w-full py-3 bg-transparent text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConnectWalletModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/20 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,104,95,0.12)] overflow-hidden flex flex-col border border-white/40">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance_wallet</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-5xl transition-colors group">
              <span className="material-symbols-outlined text-outline group-hover:text-on-surface">close</span>
            </button>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Connect Wallet</h2>
          <p className="font-body text-on-surface-variant mt-2 text-sm leading-relaxed">Choose a wallet to connect to CareChain</p>
        </div>

        <div className="px-8 space-y-3">
          <button onClick={onClose} className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-2xl transition-all duration-200 group border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                <img alt="Phantom Icon" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXg-xRp_U75jcxrI3PgXhmJoGZV1uSN924pHTWHMNSczdZTIPXan4-yyR1LrDcBCKt9Yfg07ku2eTZ3GscAgaW5mdQAJMc0eGzckokS92LiBd-y1I-rFMiRoZJkXSH2YXbVPHhPRX_0KDKdM8v7I_DROQky1uSN4LtaNAzpux1lY0WNt2UA8QP9fCzgKa593CEB9GFogNQDbIrHK7LpY5VhBNONi2daGB9EE-l7BjLFjMR7Hl7Yz4yuFfQ0pHQz3oUNmB36GPepwdN" />
              </div>
              <span className="font-headline font-semibold text-on-surface">Phantom</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
          </button>
          <button onClick={onClose} className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-2xl transition-all duration-200 group border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                <img alt="Solflare Icon" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0MBFqMD4_HLJNv6z0nMOM95WjT-D5NbaUgY7eEw3y-5ivrfhg9v0pazzTA0eU2kKUSHdPVrhn-NuJZIl9Fyi6jXpxiC5_e59lH9AmHUrwk6EkREjZI2W6iF-Fk6ucVYA_ozu5rLsPkHennnG4P9RvwpyLIdtsoxk5MY3v4hr-LG42q-B3ehKqJeQA7JMQ_lhQfWe3ATArO30yuBpx_ClKYRfPz-0AEazENhHR-6gvWYHN2O-G43N7WUNIoi8YUDQ5GcgyfnSSY7h" />
              </div>
              <span className="font-headline font-semibold text-on-surface">Solflare</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
          </button>
          <button onClick={onClose} className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-2xl transition-all duration-200 group border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                <img alt="OKX Icon" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfyMZyBSCbPlZJptP9Vor0fOO1JV7C1r9xh8OXcYr1iHTuXBp01Sz6s3sV9hWpNcvugKYA5pZNQUJ0hkTlY90Jiu0w6zUbTLstS2ct-mHn9_s3Frh3sHjTqAH-IbjRZol-TqOLwwRbr1aOjQaAHe3A-yDpLVp6zq_JPVsMoD-Z5z-dLWInXj9Q6AmkfqZvhLTxvk2S9Vr8hPARApBMca0ec0jYNTrFD2VWXMGcIoGpq4l6DFAFWzj3x5km5RfWaht8yvT7htrXLPPW" />
              </div>
              <span className="font-headline font-semibold text-on-surface">OKX Wallet</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
          </button>
        </div>

        <div className="p-8 mt-4 border-t border-surface-container-high/50 bg-surface-container-low/30">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input className="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" type="checkbox" />
            </div>
            <span className="font-body text-xs text-on-surface-variant leading-relaxed select-none">
              I have read and agree to the <a className="text-primary hover:underline font-semibold" href="#">Terms & Conditions</a> and <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>. By connecting your wallet, you acknowledge asset ownership verification by CareChain.
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function QueueAdmissionModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen)
    return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/20 backdrop-blur-[4px]">
      <div className="bg-surface-container-lowest w-full max-w-xl mx-4 rounded-xl shadow-2xl overflow-hidden border border-white/40">
        <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">Admission Application Confirmation</h2>
            <p className="text-sm text-on-surface-variant font-label tracking-wide uppercase mt-0.5">FACILITY ID: <span className="text-primary font-bold">FSH-A301</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-5xl transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">analytics</span>
                <span className="text-xs font-label uppercase font-semibold">CURRENT STATUS</span>
              </div>
              <div className="text-lg font-bold text-on-surface">P3 Standard Queue</div>
              <div className="text-2xl font-headline font-extrabold text-primary">#142</div>
            </div>
            <div className="bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-label uppercase font-semibold">Estimated Wait Time</span>
              </div>
              <div className="text-lg font-bold text-on-surface">Approx. 18 months</div>
              <div className="text-sm text-error font-medium">Standard Release</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-on-surface">Acceleration Control (Burn $CARE)</label>
              <div className="text-right">
                <span className="text-2xl font-headline font-bold text-secondary">2,500</span>
                <span className="text-sm font-label text-on-surface-variant ml-1">$CARE</span>
              </div>
            </div>
            <div className="relative pt-2">
              <input className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="10000" min="0" step="100" type="range" defaultValue="2500" />
              <div className="flex justify-between mt-3 text-[10px] font-bold text-outline uppercase tracking-tighter">
                <span>Standard</span>
                <span>Fast</span>
                <span>Priority</span>
                <span>Instant</span>
              </div>
            </div>
          </div>
          <div className="bg-secondary/5 rounded-xl p-6 border-l-4 border-secondary">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">ACCELERATION PREVIEW</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs text-on-surface-variant font-medium mb-1">New Rank</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-headline font-extrabold text-on-surface">#12</span>
                  <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-5xl">P2 FAST TRACK</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant font-medium mb-1">Time Saved</div>
                <div className="text-2xl font-headline font-extrabold text-tertiary">~17 Months</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
            <div>
              <div className="text-xs text-on-surface-variant font-medium mb-1">Total Burn Amount</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-headline font-extrabold text-on-surface">2,500 $CARE</span>
                <span className="text-sm text-on-surface-variant">≈ 1,240.50 USDC</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">EST. GAS: $2.40</div>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-surface-container-low flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-5xl font-headline font-bold text-center transition-all active:scale-[0.98] shadow-lg shadow-primary/20">Confirm &amp; Apply for Admission</button>
          <button onClick={onClose} className="px-8 py-4 bg-transparent text-on-surface-variant font-headline font-bold rounded-5xl hover:bg-surface-container-high transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  )
}
