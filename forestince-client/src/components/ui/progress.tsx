import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className={cn('relative h-1.75 w-full overflow-hidden rounded-md bg-surface', className)}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full rounded-md transition-all duration-300', indicatorClassName)}
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  )
}
