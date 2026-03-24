import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { Booking } from '../types/dashboard'

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings?pageSize=5`)
  const json = await res.json() as ApiResponse<{ data: Booking[] }>
  if (!json.isOk) throw new Error(json.message)
  return json.payload.data
}
