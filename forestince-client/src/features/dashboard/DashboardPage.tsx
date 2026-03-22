import { Suspense, useMemo, useState } from 'react'
import { cn } from '../../lib/utils'
import { Skeleton } from '../../components/ui/skeleton'
import { StatsRow } from './components/StatsRow'
import { BookingsPanel } from './components/BookingsPanel'
import { FacilityUsagePanel } from './components/FacilityUsagePanel'
import { CampusMapView } from './components/CampusMapView'
import { getDashboardStats } from './api/getDashboardStats'
import { getDashboardUsage } from './api/getDashboardUsage'
import { getBookings } from './api/getBookings'
import type { DashboardWindow } from './types/dashboard'

const WINDOWS: { value: DashboardWindow; label: string }[] = [
  { value: '24h', label: 'Last 24h' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '28d', label: 'Last 28 days' },
]

function StatsSkeletons() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex flex-col gap-2">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <Skeleton className="h-2.5 w-20 mt-1" />
          <Skeleton className="h-7 w-14" />
        </div>
      ))}
    </>
  )
}

const BOOKINGS_COLS = 'grid grid-cols-[2fr_1.5fr_1.5fr_1fr]'

function BookingsSkeleton() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden bg-white rounded-2xl shadow-sm p-5">
      <div className="mb-4 shrink-0">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className={cn(BOOKINGS_COLS, 'gap-2 pb-2.5 border-b border-surface shrink-0')}>
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-2.5 w-20" />)}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn(BOOKINGS_COLS, 'gap-2 py-3 items-center border-b border-surface')}>
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function UsageSkeleton() {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <Skeleton className="h-3.5 w-28 mb-3.5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-7" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const [window, setWindow] = useState<DashboardWindow>('28d')

  const statsPromise    = useMemo(() => getDashboardStats(window),  [window])
  const usagePromise    = useMemo(() => getDashboardUsage(window),  [window])
  const bookingsPromise = useMemo(() => getBookings(), [])

  function handleWindowChange(w: DashboardWindow) {
    setWindow(w)
  }

  return (
    <div className="flex-1 overflow-auto flex flex-col gap-4 p-4 lg:p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
        <h1 className="text-[15px] font-extrabold text-color-fg">Dashboard</h1>
        <div className={cn('flex rounded-lg border border-muted bg-white shadow-sm overflow-hidden')}>
          {WINDOWS.map(w => (
            <button
              key={w.value}
              onClick={() => handleWindowChange(w.value)}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer',
                window === w.value
                  ? 'bg-brand text-white'
                  : 'text-fg-muted hover:bg-surface'
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <Suspense fallback={<StatsSkeletons />}>
          <StatsRow promise={statsPromise} />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <Suspense fallback={<BookingsSkeleton />}>
          <BookingsPanel promise={bookingsPromise} />
        </Suspense>

        <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 lg:flex lg:flex-col lg:w-62 lg:shrink-0">
          <Suspense fallback={<UsageSkeleton />}>
            <FacilityUsagePanel promise={usagePromise} />
          </Suspense>
          <div className="bg-white rounded-2xl px-3.5 pt-3.5 pb-3 shadow-sm">
            <CampusMapView />
          </div>
        </div>
      </div>
    </div>
  )
}
