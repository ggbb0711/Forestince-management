import { StatusBadge } from '../../../../components/StatusBadge'
import { Skeleton } from '../../../../components/ui/skeleton'
import { formatDateTime } from '../../../../lib/formatDateTime'
import type { ListProps } from './types'

export function MobileBookingsList({ bookings, loading, error, onRowClick }: ListProps) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {error && <div className="text-red-700 text-[13px] px-1">{error}</div>}

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        ))
      ) : (
        bookings.map(b => (
          <div
            key={b.id}
            onClick={() => onRowClick(b.id, `Booking — ${b.user.name}`)}
            className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-start justify-between gap-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="min-w-0">
              <div className="font-bold text-[13px] text-color-fg truncate">{b.user.name}</div>
              <div className="text-[11px] text-fg-muted">{b.user.company.name}</div>
              <div className="text-[11px] text-fg-muted mt-0.5">{formatDateTime(b.startTime)}</div>
            </div>
            <StatusBadge status={b.status} />
          </div>
        ))
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-[13px] text-fg-muted text-center py-6">No bookings found.</div>
      )}
    </div>
  )
}
