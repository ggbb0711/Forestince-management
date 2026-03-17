import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Skeleton } from '../../components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { FacilityBookingsTab } from './components/FacilityBookingsTab/index'
import { useFacility } from './hooks/useFacility'

function FacilityDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-9 w-32 rounded-lg" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export function FacilityDetailPage() {
  const { facilityId } = useParams<{ facilityId: string }>()
  const { facility, loading, error } = useFacility(facilityId!)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />

        {loading && <FacilityDetailSkeleton />}

        {error && (
          <div className="text-red-700 text-[13px]">{error}</div>
        )}

        {!loading && facility && (
          <>
            <div className="mb-4">
              <h1 className="text-[18px] font-extrabold text-color-fg">{facility.name}</h1>
              <p className="text-[12px] text-fg-muted mt-0.5">
                {facility._count.bookings} booking{facility._count.bookings !== 1 ? 's' : ''}
              </p>
            </div>

            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              <TabsContent value="bookings">
                <FacilityBookingsTab facilityId={facilityId!} facilityName={facility.name} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
