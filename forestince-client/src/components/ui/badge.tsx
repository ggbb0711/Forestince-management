import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide whitespace-nowrap',
  {
    variants: {
      variant: {
        confirmed: 'bg-good-bg text-good',
        pending:   'bg-pending-bg text-pending',
        completed: 'bg-completed-bg text-completed',
        cancelled: 'bg-cancelled-bg text-cancelled',
        default:   'bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  )
}
