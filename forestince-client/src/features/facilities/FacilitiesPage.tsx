import { Breadcrumbs } from '../../components/Breadcrumbs'
import { FacilityCard } from './components/FacilityCard'
import { FacilityCardSkeleton } from './components/FacilityCardSkeleton'
import { useFacilities } from './hooks/useFacilities'

export function FacilitiesPage() {
  const { facilities, loading, error } = useFacilities()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />
        <h1 className="text-[18px] font-extrabold text-color-fg mb-4">Facilities</h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FacilityCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-red-700 text-[13px]">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((f, i) => (
              <FacilityCard key={f.id} facility={f} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
