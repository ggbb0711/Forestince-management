import { useQuery } from '../../../hooks/useQuery'
import type { FacilityBooking } from '../types/facility'
import { getBookingById } from '../api/getBookingById'

interface UseBookingDetailResult {
  booking: FacilityBooking | null
  loading: boolean
  error: string | null
}

export function useBookingDetail(id: string): UseBookingDetailResult {
  const { data: booking, loading, error } = useQuery<FacilityBooking>(
    () => getBookingById(id),
    [id],
    { errorTitle: 'Failed to load booking' }
  )
  return { booking, loading, error }
}
