import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { AppHeader } from '@/components/layout/app-header'
import { Providers } from '@/components/providers'
import { cn } from '@/utils'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-headline' })

export const metadata: Metadata = {
  title: 'CareChain',
  description: 'CareChain Protocol - Sovereign Sanctuary',
}

export default function RootLayout({
  children,
}: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('scroll-smooth', inter.variable, manrope.variable)}>
      <head>
        {/* eslint-disable-next-line next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased">
        <Providers>
          <div className="app min-h-screen">
            <AppHeader />
            <main>
              <div className="mx-auto">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
