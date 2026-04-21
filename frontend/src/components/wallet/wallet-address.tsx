import { cn } from '@/utils'

interface WalletAddressProps {
  address: string
  className?: string
  full?: boolean
}

export function WalletAddress({ address, className, full = false }: WalletAddressProps) {
  if (!address)
    return null

  const formattedAddress = full
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className={cn(
      'px-3 py-1 bg-surface-high rounded-full border border-tertiary/20 transition-colors inline-flex items-center gap-1.5 font-body text-xs text-on-surface-variant leading-relaxed select-none',
      className,
    )}
    >
      {formattedAddress}
    </div>
  )
}
