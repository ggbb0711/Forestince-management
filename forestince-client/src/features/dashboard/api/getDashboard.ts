import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { DashboardSummary, DashboardWindow } from '../types/dashboard'

export async function getDashboard(window: DashboardWindow = '28d'): Promise<DashboardSummary> {
  const res = await fetch(`${API_URL}/dashboard?window=${window}`)
  const json = await res.json() as ApiResponse<DashboardSummary>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
