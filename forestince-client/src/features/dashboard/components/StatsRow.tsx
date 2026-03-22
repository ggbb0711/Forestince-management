import { use } from 'react'
import { StatCard } from './StatCard'
import type { DashboardStats, StatItem } from '../types/dashboard'

export function StatsRow({ promise }: { promise: Promise<DashboardStats> }) {
  const stats = use(promise)

  const items: StatItem[] = [
    { label: 'Total Bookings',    value: String(stats.totalBookings),   change: stats.totalBookingsChange,   highlight: false },
    { label: 'Active Facilities', value: String(stats.totalFacilities), change: null,                        highlight: false },
    { label: 'Registered Users',  value: String(stats.registeredUsers), change: null,                        highlight: false },
    { label: 'Pending Requests',  value: String(stats.pendingRequests), change: stats.pendingRequestsChange, highlight: true  },
  ]

  return <>{items.map(s => <StatCard key={s.label} {...s} />)}</>
}
