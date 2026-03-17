import { Badge } from './ui/badge'
import type { BadgeVariant } from './ui/badge'

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status.toUpperCase()] ?? 'default'
  return <Badge variant={variant}>{status}</Badge>
}
