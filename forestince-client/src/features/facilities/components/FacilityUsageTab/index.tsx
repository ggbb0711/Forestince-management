import { Suspense, use, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { FilterBar } from '../../../../components/FilterBar'
import { Skeleton } from '../../../../components/ui/skeleton'
import { getFacilityStats } from '../../api/getFacilityStats'
import type { FacilityStatBreakdown } from '../../types/facility'

interface FacilityUsageTabProps {
  facilityId: string
}

function UsageSkeleton() {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <Skeleton className="h-2.5 w-20" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-3.5 w-6 shrink-0" />
          </div>
        ))}
      </div>
    </>
  )
}

function UsageContent({ promise }: { promise: Promise<FacilityStatBreakdown> }) {
  const stats = use(promise)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[12px] font-bold text-fg-muted uppercase tracking-wide">
            Daily Bookings
          </span>
          <span className="text-[11px] text-fg-muted">
            {new Date(stats.dateFrom).toLocaleDateString()} – {new Date(stats.dateTo).toLocaleDateString()}
          </span>
        </div>
        {stats.dailyUsage.length === 0 ? (
          <p className="text-fg-muted text-[13px]">No data for this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.dailyUsage} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#208D26" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#208D26" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(dateStr: string) => {
                  const d = new Date(dateStr)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                labelFormatter={label => new Date(label).toLocaleDateString()}
                formatter={(value) => [value, 'Bookings']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#208D26"
                strokeWidth={2}
                fill="url(#usageGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#208D26' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-[12px] font-bold text-fg-muted uppercase tracking-wide mb-3">Top Bookers</h3>
        {stats.topBookers.length === 0 ? (
          <p className="text-fg-muted text-[13px]">No bookings in this period.</p>
        ) : (
          <ol className="flex flex-col gap-2.5">
            {stats.topBookers.map(booker => (
              <li key={booker.userId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-muted text-brand text-[11px] font-bold flex items-center justify-center shrink-0">
                  {booker.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-color-fg truncate">{booker.userName}</p>
                  <p className="text-[11px] text-fg-muted truncate">{booker.companyName}</p>
                </div>
                <span className="text-[13px] font-extrabold text-brand font-mono shrink-0">{booker.bookingCount}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  )
}

export function FacilityUsageTab({ facilityId }: FacilityUsageTabProps) {
  const [dateFrom, setDateFrom] = useState<string | undefined>()
  const [dateTo, setDateTo]     = useState<string | undefined>()

  const statsPromise = useMemo(
    () => getFacilityStats(facilityId, dateFrom, dateTo),
    [facilityId, dateFrom, dateTo],
  )

  const hasActiveFilters = !!(dateFrom || dateTo)

  function clearFilters() {
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        showDateRange
        values={{ dateFrom, dateTo }}
        onChange={patch => {
          if ('dateFrom' in patch) setDateFrom(patch.dateFrom)
          if ('dateTo'   in patch) setDateTo(patch.dateTo)
        }}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <Suspense fallback={<UsageSkeleton />}>
        <UsageContent promise={statsPromise} />
      </Suspense>
    </div>
  )
}
