import { cn } from '../../../../lib/utils'
import { StatusBadge } from '../../../../components/StatusBadge'
import { formatDateTime } from '../../../../lib/formatDateTime'
import type { ListProps } from './types'

export function DesktopBookingsList({ bookings, onRowClick }: ListProps) {
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden max-h-75 overflow-y-auto">
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 border-b border-surface">
        {['EMPLOYEE', 'START TIME', 'END TIME', 'STATUS'].map(h => (
          <span key={h} className="text-[10px] font-bold text-fg-muted tracking-[0.6px]">{h}</span>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="px-5 py-8 text-[13px] text-fg-muted text-center">No bookings found.</div>
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
    </div>
  )
}
