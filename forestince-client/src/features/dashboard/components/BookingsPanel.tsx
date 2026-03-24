import { useNavigate, Link } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { StatusBadge } from '../../../components/StatusBadge'
import { Skeleton } from '../../../components/ui/skeleton'
import { FacilityTypeIcon } from '../../../components/FacilityTypeIcon'
import { Button } from '../../../components/ui/button'
import { IconPlus } from '../../../assets/icons/IconPlus'
import { IconChevronRight } from '../../../assets/icons/IconChevronRight'
import { formatDateTime } from '../../../lib/formatDateTime'
import type { Booking } from '../types/dashboard'

function SkeletonRows({ cols }: { cols: string }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn(cols, 'gap-2 py-3 items-center border-b border-surface')}>
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </>
  )
}

interface ListProps {
  bookings: Booking[]
  loading: boolean
  error: string | null
  onViewAll: () => void
  onBookingClick: (booking: Booking) => void
}

function MobileBookingsPanel({ bookings, loading, error, onViewAll, onBookingClick }: ListProps) {
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-[15px] font-extrabold text-color-fg">Recent Bookings</h2>
        <div className="flex gap-2">
          <Button variant="primary" asChild><Link to="/facilities/new"><IconPlus /> Booking</Link></Button>
          <Button variant="ghost" onClick={onViewAll}>View All</Button>
        </div>
      </div>

      {loading && (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm px-3.5 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))
      )}

      {error && <div className="text-red-700 text-[13px]">{error}</div>}

      {!loading && !error && bookings.map(b => (
        <div
          key={b.id}
          onClick={() => onBookingClick(b)}
          className="bg-white rounded-xl shadow-sm px-3.5 py-3 flex items-start gap-3 cursor-pointer hover:bg-surface transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <FacilityTypeIcon id={b.facility.id} size={14} color="#2e7d32" />
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

function DesktopBookingsPanel({ bookings, loading, error, onViewAll, onBookingClick }: ListProps) {
  const COLS = 'grid grid-cols-[2fr_1.5fr_1.5fr_1fr]'

  return (
    <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden bg-white rounded-2xl shadow-sm p-5">
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[15px] font-extrabold text-color-fg">Recent Bookings</h2>
          <div className="flex gap-2">
            <Button variant="primary" asChild><Link to="/facilities/new"><IconPlus /> Booking</Link></Button>
            <Button variant="ghost" onClick={onViewAll}>View All</Button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-700 text-[13px] py-5">{error}</div>}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className={cn(COLS, 'gap-2 pb-2.5 border-b border-surface shrink-0')}>
          {['FACILITY NAME', 'EMPLOYEE NAME', 'DATE/TIME', 'STATUS'].map(h => (
            <span key={h} className="text-[10px] font-bold text-fg-muted tracking-[0.6px]">{h}</span>
          ))}
        </div>
        <div className="overflow-auto flex-1">
          {loading && <SkeletonRows cols={COLS} />}

          {!loading && !error && bookings.map((b, i) => (
            <div
              key={b.id}
              onClick={() => onBookingClick(b)}
              className={cn(
                COLS,
                'gap-2 py-3 items-center cursor-pointer hover:bg-surface transition-colors rounded-sm',
                i < bookings.length - 1 ? 'border-b border-surface' : ''
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-[7px] bg-good-icon-bg flex items-center justify-center shrink-0">
                  <FacilityTypeIcon id={b.facility.id} size={14} color="#2e7d32" />
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
    </div>
  )
}

export interface BookingsPanelProps {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

export function BookingsPanel({ bookings, loading, error }: BookingsPanelProps) {
  const navigate = useNavigate()

  function handleBookingClick(b: Booking) {
    navigate(`/facilities/${b.facility.id}/bookings/${b.id}`, {
      state: {
        facilityName: b.facility.name,
        bookingLabel: `Booking — ${b.user.name}`,
      },
    })
  }

  function handleViewAll() {
    navigate('/facilities')
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 gap-3">
      <MobileBookingsPanel
        bookings={bookings}
        loading={loading}
        error={error}
        onViewAll={handleViewAll}
        onBookingClick={handleBookingClick}
      />
      <DesktopBookingsPanel
        bookings={bookings}
        loading={loading}
        error={error}
        onViewAll={handleViewAll}
        onBookingClick={handleBookingClick}
      />
    </div>
  )
}
