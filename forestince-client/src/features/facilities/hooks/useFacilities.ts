import { useState, useEffect, useTransition } from 'react'
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
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getFacilities()
        setFacilities(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load facilities', { description: msg })
      }
    })
  }, [])

  return { facilities, loading: isPending, error }
}
