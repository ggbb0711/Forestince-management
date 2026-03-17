import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
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
  const [stats, setStats] = useState<FacilityStatBreakdown | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getFacilityStats(facilityId, dateFrom, dateTo)
        setStats(data)
        setError(null)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load facility stats', { description: msg })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId, dateFrom, dateTo])

  return { stats, loading: isPending, error }
}
