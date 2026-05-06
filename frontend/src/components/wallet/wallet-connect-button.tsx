import { Button } from '@/components/ui/button'

interface WalletConnectButtonProps {
  onClick: () => void
}

export function WalletConnectButton({ onClick }: WalletConnectButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-primary text-white font-bold px-6 py-2 rounded-5xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap"
    >
      Connect Wallet
    </Button>
  )
}
