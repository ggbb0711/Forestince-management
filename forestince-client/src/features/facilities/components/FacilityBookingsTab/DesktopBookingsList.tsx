import { cn } from '../../../../lib/utils'
import { StatusBadge } from '../../../../components/StatusBadge'
import { Skeleton } from '../../../../components/ui/skeleton'
import { formatDateTime } from '../../../../lib/formatDateTime'
import type { ListProps } from './types'

export function DesktopBookingsList({ bookings, loading, error, onRowClick }: ListProps) {
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 border-b border-surface">
        {['EMPLOYEE', 'START TIME', 'END TIME', 'STATUS'].map(h => (
          <span key={h} className="text-[10px] font-bold text-fg-muted tracking-[0.6px]">{h}</span>
        ))}
      </div>

      {error && <div className="px-5 py-4 text-red-700 text-[13px]">{error}</div>}

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 border-b border-surface">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))
      ) : (
        bookings.map((b, i) => (
          <div
            key={b.id}
            onClick={() => onRowClick(b.id, `Booking — ${b.user.name}`)}
            className={cn(
              'grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 items-center cursor-pointer hover:bg-surface transition-colors',
              i < bookings.length - 1 ? 'border-b border-surface' : ''
            )}
          >
            <div className="min-w-0">
              <div className="font-semibold text-xs text-color-fg truncate">{b.user.name}</div>
              <div className="text-[11px] text-fg-muted truncate">{b.user.company.name}</div>
            </div>
            <span className="text-fg-muted text-xs">{formatDateTime(b.startTime)}</span>
            <span className="text-fg-muted text-xs">{formatDateTime(b.endTime)}</span>
            <StatusBadge status={b.status} />
          </div>
        ))
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="px-5 py-8 text-[13px] text-fg-muted text-center">No bookings found.</div>
      )}
    </div>
  )
}
