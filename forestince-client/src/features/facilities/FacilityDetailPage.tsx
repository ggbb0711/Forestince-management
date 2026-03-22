import { Suspense, use, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Skeleton } from '../../components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { FacilityBookingsTab } from './components/FacilityBookingsTab/index'
import { FacilityUsageTab } from './components/FacilityUsageTab/index'
import { getFacilityById } from './api/getFacilityById'
import type { Facility } from './types/facility'

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

function FacilityDetail({ promise, facilityId }: { promise: Promise<Facility>; facilityId: string }) {
  const facility = use(promise)

  return (
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
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <FacilityBookingsTab facilityId={facilityId} facilityName={facility.name} />
        </TabsContent>
        <TabsContent value="usage">
          <FacilityUsageTab facilityId={facilityId} />
        </TabsContent>
      </Tabs>
    </>
  )
}

export function FacilityDetailPage() {
  const { facilityId } = useParams<{ facilityId: string }>()
  const facilityPromise = useMemo(() => getFacilityById(facilityId!), [facilityId])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />
        <Suspense fallback={<FacilityDetailSkeleton />}>
          <FacilityDetail promise={facilityPromise} facilityId={facilityId!} />
        </Suspense>
      </div>
    </div>
  )
}
