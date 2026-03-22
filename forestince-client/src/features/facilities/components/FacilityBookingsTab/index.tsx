import { Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { Skeleton } from '../../../../components/ui/skeleton'
import { FilterBar } from '../../../../components/FilterBar'
import { getFacilityBookings } from '../../api/getFacilityBookings'
import { BookingsList } from './BookingsList'
import type { BookingFilters } from '../../types/facility'

interface FacilityBookingsTabProps {
  facilityId: string
  facilityName: string
}

function BookingsListSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        ))}
      </div>
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 border-b border-surface">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-16" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr] gap-2 px-5 py-3 border-b border-surface">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </>
  )
}

export function FacilityBookingsTab({ facilityId, facilityName }: FacilityBookingsTabProps) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<BookingFilters>({ page: 1, pageSize: 10 })
  const [searchInput, setSearchInput] = useState('')

  const bookingsPromise = useMemo(
    () => getFacilityBookings(facilityId, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [facilityId, JSON.stringify(filters)],
  )

  const applyDebouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }))
      }, 400),
    [],
  )

  function handleFilterChange(patch: Partial<BookingFilters>) {
    if ('search' in patch) {
      setSearchInput(patch.search ?? '')
      applyDebouncedSearch(patch.search ?? '')
    } else {
      setFilters(prev => ({ ...prev, ...patch, page: 1 }))
    }
  }

  function clearFilters() {
    setSearchInput('')
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
    search: searchInput,
  }
  const hasActiveFilters = !!(filters.status ?? filters.dateFrom ?? filters.dateTo ?? searchInput)

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
      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList
          promise={bookingsPromise}
          onRowClick={handleRowClick}
          onPrev={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          onNext={() => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
        />
      </Suspense>
    </div>
  )
}
