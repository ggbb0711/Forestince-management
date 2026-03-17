import { useQuery } from '../../../hooks/useQuery'
import { getDashboard } from '../api/getDashboard'
import type { DashboardSummary, DashboardWindow } from '../types/dashboard'

interface UseDashboardResult {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
}

export function useDashboard(window: DashboardWindow = '28d'): UseDashboardResult {
  const { data: summary, loading, error } = useQuery(
    () => getDashboard(window),
    [window],
    { errorTitle: 'Failed to load dashboard' }
  )
  return { summary, loading, error }
}
