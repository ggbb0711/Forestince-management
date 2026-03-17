import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import type { FacilityBooking, BookingFilters } from '../types/facility'
import type { PaginationMeta } from '../../../lib/paginationMeta'
import { getFacilityBookings } from '../api/getFacilityBookings'

interface UseFacilityBookingsResult {
  bookings: FacilityBooking[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
}

export function useFacilityBookings(facilityId: string, filters: BookingFilters): UseFacilityBookingsResult {
  const [bookings, setBookings] = useState<FacilityBooking[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await getFacilityBookings(facilityId, filters)
        setBookings(result.data)
        setMeta(result.meta)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load bookings', { description: msg })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId, filtersKey])

  return { bookings, meta, loading: isPending, error }
}
