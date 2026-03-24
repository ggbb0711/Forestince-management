import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { FacilityStatBreakdown } from '../types/facility'

export async function getFacilityStats(
  facilityId: string | number,
  dateFrom?: string,
  dateTo?: string
): Promise<FacilityStatBreakdown> {
  const params = new URLSearchParams()
  if (dateFrom) params.set('dateFrom', dateFrom)
  if (dateTo)   params.set('dateTo', dateTo)

  const query = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${API_URL}/reports/facility-stats/${facilityId}${query}`)
  const json = await res.json() as ApiResponse<FacilityStatBreakdown>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
