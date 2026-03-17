import { useState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import { getDashboard } from '../api/getDashboard'
import type { DashboardSummary, DashboardWindow } from '../types/dashboard'

interface UseDashboardResult {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
}

export function useDashboard(window: DashboardWindow = '28d'): UseDashboardResult {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getDashboard(window)
        setSummary(data)
        setError(null)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        toast.error('Failed to load dashboard', { description: msg })
      }
    })
  }, [window])

  return { summary, loading: isPending, error }
}
