import { useState } from 'react'
import { cn } from '../../lib/utils'
import { useDashboard } from './hooks/useDashboard'
import { StatCard } from './components/StatCard'
import { BookingsPanel } from './components/BookingsPanel'
import { FacilityUsagePanel } from './components/FacilityUsagePanel'
import { CampusMapView } from './components/CampusMapView'
import { Skeleton } from '../../components/ui/skeleton'
import type { StatItem, DashboardWindow } from './types/dashboard'

const WINDOWS: { value: DashboardWindow; label: string }[] = [
  { value: '24h', label: 'Last 24h' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '28d', label: 'Last 28 days' },
]

export function DashboardPage() {
  const [window, setWindow] = useState<DashboardWindow>('28d')
  const { summary, loading, error } = useDashboard(window)

  const stats: StatItem[] = summary
    ? [
        { label: 'Total Bookings',    value: String(summary.stats.totalBookings), change: summary.stats.totalBookingsChange, highlight: false },
        { label: 'Active Facilities', value: String(summary.stats.totalFacilities), change: null, highlight: false },
        { label: 'Registered Users',  value: String(summary.stats.registeredUsers), change: null, highlight: false },
        { label: 'Pending Requests',  value: String(summary.stats.pendingRequests), change: summary.stats.pendingRequestsChange, highlight: true  },
      ]
    : [
        { label: 'Total Bookings',    value: '—', change: null, highlight: false },
        { label: 'Active Facilities', value: '—', change: null, highlight: false },
        { label: 'Registered Users',  value: '—', change: null, highlight: false },
        { label: 'Pending Requests',  value: '—', change: null, highlight: true  },
      ]

  return (
    <div className="flex-1 overflow-auto flex flex-col gap-4 p-4 lg:p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
        <h1 className="text-[15px] font-extrabold text-color-fg">Dashboard</h1>
        <div className="flex rounded-lg border border-muted bg-white shadow-sm overflow-hidden">
          {WINDOWS.map(w => (
            <button
              key={w.value}
              onClick={() => setWindow(w.value)}
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

      {error && <div className="text-red-700 text-[13px] shrink-0">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex flex-col gap-2">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="h-2.5 w-20 mt-1" />
                <Skeleton className="h-7 w-14" />
              </div>
            ))
          : stats.map(s => <StatCard key={s.label} {...s} />)
        }
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <BookingsPanel
          bookings={summary?.recentBookings ?? []}
          loading={loading}
          error={error}
        />

        <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 lg:flex lg:flex-col lg:w-62 lg:shrink-0">
          <FacilityUsagePanel
            items={summary?.facilityUsage ?? []}
            loading={loading}
          />
          <div className="bg-white rounded-2xl px-3.5 pt-3.5 pb-3 shadow-sm">
            <CampusMapView />
          </div>
        </div>
      </div>
    </div>
  )
}
