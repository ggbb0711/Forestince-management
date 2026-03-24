import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { Facility } from '../types/facility'

export async function getFacilityById(id: string): Promise<Facility> {
  const res = await fetch(`${API_URL}/facilities/${id}`)
  const json = await res.json() as ApiResponse<Facility>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
