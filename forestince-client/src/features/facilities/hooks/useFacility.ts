import { useQuery } from '../../../hooks/useQuery'
import type { Facility } from '../types/facility'
import { getFacilityById } from '../api/getFacilityById'

interface UseFacilityResult {
  facility: Facility | null
  loading: boolean
  error: string | null
}

export function useFacility(id: string): UseFacilityResult {
  const { data: facility, loading, error } = useQuery<Facility>(
    () => getFacilityById(id),
    [id],
    { errorTitle: 'Failed to load facility' }
  )
  return { facility, loading, error }
}
