import { use } from 'react'
import { Pagination } from '../../../../components/Pagination'
import { DesktopBookingsList } from './DesktopBookingsList'
import { MobileBookingsList } from './MobileBookingsList'
import type { FacilityBooking } from '../../types/facility'
import type { PaginationMeta } from '../../../../lib/paginationMeta'

interface BookingsListProps {
  promise: Promise<{ data: FacilityBooking[]; meta: PaginationMeta }>
  onRowClick: (bookingId: string, bookingLabel: string) => void
  onPrev: () => void
  onNext: () => void
}

export function BookingsList({ promise, onRowClick, onPrev, onNext }: BookingsListProps) {
  const { data: bookings, meta } = use(promise)

  return (
    <>
      <MobileBookingsList bookings={bookings} onRowClick={onRowClick} />
      <DesktopBookingsList bookings={bookings} onRowClick={onRowClick} />
      {meta.totalPages > 1 && (
        <Pagination meta={meta} onPrev={onPrev} onNext={onNext} />
      )}
    </>
  )
}
