import { StatusBadge } from '../../../../components/StatusBadge'
import { formatDateTime } from '../../../../lib/formatDateTime'
import type { ListProps } from './types'

export function MobileBookingsList({ bookings, onRowClick }: ListProps) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {bookings.length === 0 ? (
        <div className="text-[13px] text-fg-muted text-center py-6">No bookings found.</div>
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
    </div>
  )
}
