import { useQuery } from '../../../hooks/useQuery'
import { getFacilityStats } from '../api/getFacilityStats'
import type { FacilityStatBreakdown } from '../types/facility'

interface UseFacilityStatsResult {
  stats: FacilityStatBreakdown | null
  loading: boolean
  error: string | null
}

export function useFacilityStats(
  facilityId: string | number,
  dateFrom?: string,
  dateTo?: string
): UseFacilityStatsResult {
  const { data: stats, loading, error } = useQuery<FacilityStatBreakdown>(
    () => getFacilityStats(facilityId, dateFrom, dateTo),
    [facilityId, dateFrom, dateTo],
    { errorTitle: 'Failed to load facility stats' }
  )
  return { stats, loading, error }
}
