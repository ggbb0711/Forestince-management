import { Link } from 'react-router-dom'
import { FacilityTypeIcon } from '../../../components/FacilityTypeIcon'
import type { Facility } from '../types/facility'

interface FacilityCardProps {
  facility: Facility
  index: number
}

export function FacilityCard({ facility, index }: FacilityCardProps) {
  return (
    <Link
      to={`/facilities/${facility.id}`}
      state={{ facilityName: facility.name }}
      className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 no-underline hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-good-icon-bg flex items-center justify-center">
          <FacilityTypeIcon id={facility.id} size={20} color="#2e7d32" />
        </div>
        <span className="text-[11px] font-bold text-fg-muted font-mono">#{index}</span>
      </div>

      <div>
        <h3 className="font-bold text-[14px] text-color-fg mb-0.5">{facility.name}</h3>
        <p className="text-[12px] text-fg-muted">
          {facility._count.bookings} booking{facility._count.bookings !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}
