import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  badge: string
  titleLine1: string
  titleHighlight: string
  titleLine2: string
  description: string
  primaryCta: { text: string, href: string }
  secondaryCta: { text: string, onClick?: () => void }
  backgroundImage: string
}

export function HeroSection({
  badge,
  titleLine1,
  titleHighlight,
  titleLine2,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-10 blur-sm"
          alt="Modern clinical interior"
          src={backgroundImage}
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface via-transparent to-surface" />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <span className="inline-block py-1 px-4 rounded-5xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold mb-6 tracking-widest uppercase">
          {badge}
        </span>
        <h1 className="text-6xl md:text-8xl font-extrabold text-on-surface leading-tight mb-8 tracking-tighter">
          {titleLine1} <span className="text-primary italic">{titleHighlight}</span><br />{titleLine2}
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-on-surface-variant font-light mb-12 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href={primaryCta.href}>
            <Button className="bg-linear-to-br from-[#006a31] to-primary-container text-on-primary px-10 py-4 rounded-5xl text-lg font-bold shadow-xl hover:scale-105 transition-transform h-auto">
              {primaryCta.text}
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={secondaryCta.onClick}
            className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-10 py-4 rounded-5xl text-lg font-bold hover:bg-surface-container-low transition-colors h-auto"
          >
            {secondaryCta.text}
          </Button>
        </div>
      </div>
    </section>
  )
}
