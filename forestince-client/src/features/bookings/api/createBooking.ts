import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { CreateBookingInput, CreatedBooking } from '../types/booking'

export async function createBooking(data: CreateBookingInput): Promise<CreatedBooking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json() as ApiResponse<CreatedBooking>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
