import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Skeleton } from '../../components/ui/skeleton'
import { BookingDetailView } from './components/BookingDetailView'
import { useBookingDetail } from './hooks/useBookingDetail'

function BookingDetailSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6">
      <Skeleton className="h-5 w-40 mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BookingDetailPage() {
  const { bookingId } = useParams<{ facilityId: string; bookingId: string }>()
  const { booking, loading, error } = useBookingDetail(bookingId!)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />

        {loading && <BookingDetailSkeleton />}

        {error && (
          <div className="text-red-700 text-[13px]">{error}</div>
        )}

        {!loading && booking && <BookingDetailView booking={booking} />}
      </div>
    </div>
  )
}
