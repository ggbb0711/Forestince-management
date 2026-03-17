import { useQuery } from '../../../hooks/useQuery'
import type { FacilityBooking, BookingFilters } from '../types/facility'
import type { PaginationMeta } from '../../../lib/paginationMeta'
import { getFacilityBookings } from '../api/getFacilityBookings'

type BookingsResult = { data: FacilityBooking[]; meta: PaginationMeta }

interface UseFacilityBookingsResult {
  bookings: FacilityBooking[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
}

export function useFacilityBookings(facilityId: string, filters: BookingFilters): UseFacilityBookingsResult {
  const filtersKey = JSON.stringify(filters)
  const { data, loading, error } = useQuery<BookingsResult>(
    () => getFacilityBookings(facilityId, filters),
    [facilityId, filtersKey],
    { errorTitle: 'Failed to load bookings' }
  )
  return { bookings: data?.data ?? [], meta: data?.meta ?? null, loading, error }
}
