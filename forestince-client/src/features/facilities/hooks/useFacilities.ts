import { useQuery } from '../../../hooks/useQuery'
import type { Facility } from '../types/facility'
import { getFacilities } from '../api/getFacilities'

interface UseFacilitiesResult {
  facilities: Facility[]
  loading: boolean
  error: string | null
}

export function useFacilities(): UseFacilitiesResult {
  const { data, loading, error } = useQuery<Facility[]>(
    () => getFacilities(),
    [],
    { errorTitle: 'Failed to load facilities' }
  )
  return { facilities: data ?? [], loading, error }
}
