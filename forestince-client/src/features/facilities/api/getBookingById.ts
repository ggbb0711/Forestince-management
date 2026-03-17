import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { FacilityBooking } from '../types/facility'

export async function getBookingById(id: string): Promise<FacilityBooking> {
  const res = await fetch(`${API_URL}/bookings/${id}`)
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as ApiResponse<FacilityBooking>
  return json.payload
}
