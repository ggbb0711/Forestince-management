import { API_URL } from '../../../config/env'
import type { Booking } from '../types/dashboard'

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings?pageSize=5`)
  if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`)
  const data = await res.json() as { data: Booking[] }
  return data.data
}
