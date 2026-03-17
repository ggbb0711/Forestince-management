import { cn } from '../../../lib/utils'
import { StatusBadge } from '../../../components/StatusBadge'
import { FacilityNavIcon } from '../../../assets/icons/FacilityNavIcon'
import { Button } from '../../../components/ui/button'
import { IconPlus } from '../../../assets/icons/IconPlus'
import { IconChevronRight } from '../../../assets/icons/IconChevronRight'
import { formatDateTime } from '../../../lib/formatDateTime'
import type { Booking } from '../types/dashboard'

function PanelHeader() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <h2 className="text-[15px] font-extrabold text-color-fg">Recent Bookings</h2>
      <div className="flex gap-2">
        <Button variant="primary"><IconPlus /> Booking</Button>
        <Button variant="ghost">View All</Button>
      </div>
    </div>
  )
}

interface ListProps {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

function MobileBookingsPanel({ bookings, loading, error }: ListProps) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <PanelHeader />

      {loading && <div className="text-fg-muted text-[13px]">Loading bookings...</div>}
      {error   && <div className="text-red-700 text-[13px]">{error}</div>}

      {!loading && !error && bookings.map(b => (
        <div key={b.id} className="bg-white rounded-xl shadow-sm px-3.5 py-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <FacilityNavIcon width={14} height={14} color="#2e7d32" />
                <span className="font-bold text-[13px] text-color-fg truncate">{b.facility.name}</span>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <p className="text-[11px] text-fg-muted">{b.user.name}</p>
            <p className="text-[11px] text-fg-muted mt-0.5">{formatDateTime(b.startTime)}</p>
          </div>
          <IconChevronRight className="text-slate-300 shrink-0 self-end" />
        </div>
      ))}
    </div>
  )
}

function DesktopBookingsPanel({ bookings, loading, error }: ListProps) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden bg-white rounded-2xl shadow-sm p-5">
      <div className="mb-4 shrink-0"><PanelHeader /></div>

      {loading && <div className="text-fg-muted text-[13px] py-5">Loading bookings...</div>}
      {error   && <div className="text-red-700 text-[13px] py-5">{error}</div>}

      {!loading && !error && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 pb-2.5 border-b border-surface shrink-0">
            {['FACILITY NAME', 'EMPLOYEE NAME', 'DATE/TIME', 'STATUS'].map(h => (
              <span key={h} className="text-[10px] font-bold text-fg-muted tracking-[0.6px]">{h}</span>
            ))}
          </div>
          <div className="overflow-auto flex-1">
            {bookings.map((b, i) => (
              <div key={b.id} className={cn(
                'grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 py-3 items-center',
                i < bookings.length - 1 ? 'border-b border-surface' : ''
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-[7px] bg-good-icon-bg flex items-center justify-center shrink-0">
                    <FacilityNavIcon width={14} height={14} color="#2e7d32" />
                  </div>
                  <span className="font-semibold text-xs text-color-fg truncate">{b.facility.name}</span>
                </div>
                <span className="text-fg-muted text-xs truncate">{b.user.name}</span>
                <span className="text-fg-muted text-xs">{formatDateTime(b.startTime)}</span>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export interface BookingsPanelProps {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

export function BookingsPanel({ bookings, loading, error }: BookingsPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 gap-3">
      <MobileBookingsPanel bookings={bookings} loading={loading} error={error} />
      <DesktopBookingsPanel bookings={bookings} loading={loading} error={error} />
    </div>
  )
}
