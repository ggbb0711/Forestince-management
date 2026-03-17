import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { Facility } from '../types/facility'

export async function getFacilityById(id: string): Promise<Facility> {
  const res = await fetch(`${API_URL}/facilities/${id}`)
  if (!res.ok) throw new Error(res.statusText)
  const json = await res.json() as ApiResponse<Facility>
  return json.payload
}
