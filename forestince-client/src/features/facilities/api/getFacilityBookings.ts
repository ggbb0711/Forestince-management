import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { FacilityBooking, BookingFilters } from '../types/facility'
import type { PaginationMeta } from '../../../lib/paginationMeta'

export async function getFacilityBookings(
  facilityId: string,
  filters: BookingFilters
): Promise<{ data: FacilityBooking[]; meta: PaginationMeta }> {
  const params = new URLSearchParams()
  params.set('facilityId', facilityId)
  if (filters.status !== undefined) params.set('status', filters.status)
  if (filters.dateFrom !== undefined) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo !== undefined) params.set('dateTo', filters.dateTo)
  if (filters.search !== undefined) params.set('search', filters.search)
  if (filters.page !== undefined) params.set('page', String(filters.page))
  if (filters.pageSize !== undefined) params.set('pageSize', String(filters.pageSize))

  const res = await fetch(`${API_URL}/bookings?${params.toString()}`)
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as ApiResponse<{ data: FacilityBooking[]; meta: PaginationMeta }>
  return json.payload
}
