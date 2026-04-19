import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-5xl border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-on-primary",
        secondary:
          "border-transparent bg-secondary text-on-secondary",
        tertiary:
          "border-transparent bg-tertiary text-on-tertiary",
        outline:
          "text-on-surface-variant border-outline-variant",
        ghost:
          "border-transparent bg-surface-container-high text-on-surface-variant",
        success:
          "border-transparent bg-tertiary-container text-on-tertiary-container",
        warning:
          "border-transparent bg-secondary-fixed text-on-secondary-fixed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
