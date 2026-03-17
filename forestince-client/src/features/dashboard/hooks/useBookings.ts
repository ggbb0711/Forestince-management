import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import type { Booking } from '../types/dashboard'
import { getBookings } from '../api/getBookings'

interface UseBookingsResult {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

export function useBookings(): UseBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getBookings()
        setBookings(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load bookings', { description: msg })
      }
    })
  }, [])

  return { bookings, loading: isPending, error }
}
