import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { Booking } from '../types/dashboard'

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings?pageSize=5`)
  if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`)
  const json = await res.json() as ApiResponse<{ data: Booking[] }>
  return json.payload.data
}
