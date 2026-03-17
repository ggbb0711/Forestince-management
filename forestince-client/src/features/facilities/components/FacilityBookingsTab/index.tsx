import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFacilityBookings } from '../../hooks/useFacilityBookings'
import { FilterBar } from '../../../../components/FilterBar'
import { Pagination } from '../../../../components/Pagination'
import { DesktopBookingsList } from './DesktopBookingsList'
import { MobileBookingsList } from './MobileBookingsList'
import type { BookingFilters } from '../../types/facility'

interface FacilityBookingsTabProps {
  facilityId: string
  facilityName: string
}

export function FacilityBookingsTab({ facilityId, facilityName }: FacilityBookingsTabProps) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<BookingFilters>({ page: 1, pageSize: 10 })
  const { bookings, meta, loading, error } = useFacilityBookings(facilityId, filters)

  function handleFilterChange(patch: Partial<BookingFilters>) {
    setFilters(prev => ({ ...prev, ...patch, page: 1 }))
  }

  function clearFilters() {
    setFilters({ page: 1, pageSize: 10 })
  }

  function handleRowClick(bookingId: string, bookingLabel: string) {
    navigate(`/facilities/${facilityId}/bookings/${bookingId}`, {
      state: { facilityName, bookingLabel },
    })
  }

  const filterValues = {
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    search: filters.search,
  }
  const hasActiveFilters = !!(filters.status ?? filters.dateFrom ?? filters.dateTo ?? filters.search)

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        showSearch
        showStatus
        showDateRange
        values={filterValues}
        onChange={patch => handleFilterChange(patch as Partial<BookingFilters>)}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <MobileBookingsList bookings={bookings} loading={loading} error={error} onRowClick={handleRowClick} />
      <DesktopBookingsList bookings={bookings} loading={loading} error={error} onRowClick={handleRowClick} />
      {meta && meta.totalPages > 1 && (
        <Pagination
          meta={meta}
          onPrev={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          onNext={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
        />
      )}
    </div>
  )
}
