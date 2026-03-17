import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
  options?: { errorTitle?: string }
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcher()
      .then(result => { if (!cancelled) { setData(result); setError(null) } })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Unknown error'
          setError(msg)
          if (options?.errorTitle) toast.error(options.errorTitle, { description: msg })
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
