interface TimelineStepProps {
  step: number
  title: string
  description: string
  isLast?: boolean
}

export function TimelineStep({ step, title, description }: TimelineStepProps) {
  return (
    <div className="relative bg-surface p-6 rounded-xl border border-outline-variant/10">
      <div className="w-8 h-8 rounded-5xl bg-primary text-white flex items-center justify-center mb-6 relative z-10 mx-auto md:mx-0">
        {step}
      </div>
      <h5 className="font-bold mb-2">{title}</h5>
      <p className="text-xs text-on-surface-variant">{description}</p>
    </div>
  )
}
