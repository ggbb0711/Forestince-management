import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import type { Facility } from '../types/facility'
import { getFacilityById } from '../api/getFacilityById'

interface UseFacilityResult {
  facility: Facility | null
  loading: boolean
  error: string | null
}

export function useFacility(id: string): UseFacilityResult {
  const [facility, setFacility] = useState<Facility | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getFacilityById(id)
        setFacility(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load facility', { description: msg })
      }
    })
  }, [id])

  return { facility, loading: isPending, error }
}
