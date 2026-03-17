import type { FacilityBooking } from '../../types/facility'

export interface ListProps {
  bookings: FacilityBooking[]
  loading: boolean
  error: string | null
  onRowClick: (bookingId: string, bookingLabel: string) => void
}
