import { useState } from 'react'
import { toast } from 'sonner'
import { createBooking as createBookingApi } from '../api/createBooking'
import type { CreateBookingInput, CreatedBooking } from '../types/booking'

interface UseCreateBookingResult {
  submit: (data: CreateBookingInput) => Promise<CreatedBooking | null>
  loading: boolean
}

export function useCreateBooking(): UseCreateBookingResult {
  const [loading, setLoading] = useState(false)

  async function submit(data: CreateBookingInput): Promise<CreatedBooking | null> {
    setLoading(true)
    try {
      const booking = await createBookingApi(data)
      toast.success('Booking created successfully')
      return booking
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error('Failed to create booking', { description: msg })
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading }
}
