import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { DashboardStats, DashboardWindow } from '../types/dashboard'

export async function getDashboardStats(window: DashboardWindow = '28d'): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/dashboard/stats?window=${window}`)
  if (!res.ok) throw new Error(`Failed to fetch dashboard stats: ${res.status}`)
  return ((await res.json()) as ApiResponse<DashboardStats>).payload
}
