'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnection } from '@/components/wallet/wallet-connection'
import { cn } from '@/utils'

export function AppHeader() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Priority Queue', href: '/priority-queue' },
    { name: 'Burn Logic', href: '/burn-logic' },
    // { name: 'Governance', href: '/governance' },
  ]

  return (
    <>
      <header className="bg-white/80  backdrop-blur-xl shadow-sm fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-8 max-w-[1440px] mx-auto h-16 w-full whitespace-nowrap">
          <div className="flex items-center min-w-max">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-teal-800  font-display">
              CareChain
            </Link>
          </div>
          <nav className="hidden md:flex items-center justify-center gap-8 font-display font-semibold tracking-tight h-full grow">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'flex items-center h-full pt-1 transition-colors hover:text-primary',
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-500',
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-6 min-w-max">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">settings</span>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>
    </>
  )
}
