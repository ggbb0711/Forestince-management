import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import type { FacilityBooking } from '../types/facility'
import { getBookingById } from '../api/getBookingById'

interface UseBookingDetailResult {
  booking: FacilityBooking | null
  loading: boolean
  error: string | null
}

export function useBookingDetail(id: string): UseBookingDetailResult {
  const [booking, setBooking] = useState<FacilityBooking | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getBookingById(id)
        setBooking(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load booking', { description: msg })
      }
    })
  }, [id])

  return { booking, loading: isPending, error }
}
