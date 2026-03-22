import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Facility } from '../types/facility'
import { getFacilities } from '../api/getFacilities'

interface UseFacilitiesResult {
  facilities: Facility[]
  loading: boolean
  error: string | null
}

export function useFacilities(): UseFacilitiesResult {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [error, setError] = useState<string | null>(null)
  // const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFacilities = (async () => {
      try {
        setLoading(true)
        const data = await getFacilities()
        setFacilities(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load facilities', { description: msg })
      }
      finally{
        setLoading(false)
      }
    })
    fetchFacilities()
  }, [])

  return { facilities, loading, error }
}
