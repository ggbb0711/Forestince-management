import { useOutletContext } from 'react-router-dom'
import { useBookings } from './hooks/useBookings'
import { StatCard } from './components/StatCard'
import { BookingsPanel } from './components/BookingsPanel'
import { FacilityUsagePanel } from './components/FacilityUsagePanel'
import { CampusMapView } from './components/CampusMapView'
import { Topbar } from '../../components/Topbar'
import type { LayoutOutletContext } from '../../components/Layout'
import type { StatItem, FacilityUsageItem } from './types/dashboard'

const STATS: StatItem[] = [
  { label: 'Total Bookings', value: '1,284', change: '+12%', highlight: false },
  { label: 'Active Facilities', value: '24', change: null, highlight: false },
  { label: 'Registered Users', value: '856', change: '+5.2%', highlight: false },
  { label: 'Pending Requests', value: '12', change: 'New', highlight: true },
]

const FACILITY_USAGE: FacilityUsageItem[] = [
  { name: 'Old Oak Trail', pct: 84 },
  { name: 'Zen Garden Deck', pct: 72 },
  { name: 'Silent Pods', pct: 61 },
  { name: 'Crystal Spring', pct: 48 },
  { name: 'Birch Hut', pct: 35 },
]

export function DashboardPage() {
  const { onMenuClick } = useOutletContext<LayoutOutletContext>()
  const { bookings, loading, error } = useBookings()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto flex flex-col gap-4 p-4 lg:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          <BookingsPanel bookings={bookings} loading={loading} error={error} />

          <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 lg:flex lg:flex-col lg:w-62 lg:shrink-0">
            <FacilityUsagePanel items={FACILITY_USAGE} />
            <div className="bg-white rounded-2xl px-3.5 pt-3.5 pb-3 shadow-sm">
              <CampusMapView />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
