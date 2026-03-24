import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { FacilityBooking } from '../types/facility'

export async function getBookingById(id: string): Promise<FacilityBooking> {
  const res = await fetch(`${API_URL}/bookings/${id}`)
  const json = await res.json() as ApiResponse<FacilityBooking>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
