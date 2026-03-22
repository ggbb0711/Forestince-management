import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { DashboardWindow, FacilityUsageStat } from '../types/dashboard'

export async function getDashboardUsage(window: DashboardWindow = '28d'): Promise<FacilityUsageStat[]> {
  const res = await fetch(`${API_URL}/dashboard/usage?window=${window}`)
  if (!res.ok) throw new Error(`Failed to fetch dashboard usage: ${res.status}`)
  return ((await res.json()) as ApiResponse<FacilityUsageStat[]>).payload
}
