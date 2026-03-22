import type { FacilityBooking } from '../../types/facility'

export interface ListProps {
  bookings: FacilityBooking[]
  onRowClick: (bookingId: string, bookingLabel: string) => void
}
