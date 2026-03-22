import { Suspense, use, useMemo } from 'react'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { FacilityCard } from './components/FacilityCard'
import { FacilityCardSkeleton } from './components/FacilityCardSkeleton'
import { getFacilities } from './api/getFacilities'
import type { Facility } from './types/facility'

function FacilitiesGrid({ promise }: { promise: Promise<Facility[]> }) {
  const facilities = use(promise)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {facilities.map((f, i) => (
        <FacilityCard key={f.id} facility={f} index={i + 1} />
      ))}
    </div>
  )
}

function FacilitiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <FacilityCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FacilitiesPage() {
  const facilitiesPromise = useMemo(() => getFacilities(), [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />
        <h1 className="text-[18px] font-extrabold text-color-fg mb-4">Facilities</h1>
        <Suspense fallback={<FacilitiesGridSkeleton />}>
          <FacilitiesGrid promise={facilitiesPromise} />
        </Suspense>
      </div>
    </div>
  )
}
