import { BookingStatus } from '../lib/bookingStatus'
import { Badge } from './ui/badge'
import type { BadgeVariant } from './ui/badge'

const STATUS_VARIANT: Record<BookingStatus, BadgeVariant> = {
  [BookingStatus.CONFIRMED]: 'confirmed',
  [BookingStatus.PENDING]: 'pending',
  [BookingStatus.COMPLETED]: 'completed',
  [BookingStatus.CANCELLED]: 'cancelled',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status.toUpperCase()] ?? 'default'
  return <Badge variant={variant}>{status}</Badge>
}
