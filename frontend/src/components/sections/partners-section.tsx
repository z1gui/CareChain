interface Partner {
  icon: string
  name: string
}

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  return (
    <section className="py-24 bg-surface-container-highest">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-12">
          Trusted by Leading Institutions
        </p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          {partners.map(partner => (
            <div key={partner.name} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">{partner.icon}</span>
              <span className="font-headline font-bold text-xl">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
