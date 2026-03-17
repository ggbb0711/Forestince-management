import type { BookingStatus } from '../../../lib/bookingStatus'

export type DashboardWindow = '24h' | '7d' | '28d'

export interface Booking {
  id: string
  startTime: string
  facility: { id: number; name: string }
  user: { id: string; name: string; company: { name: string } }
  status: BookingStatus
  notes: string | null
}

export interface StatItem {
  label: string
  value: string
  change: string | null
  highlight: boolean
}

export interface FacilityUsageItem {
  name: string
  pct: number
}

export interface DashboardStats {
  totalBookings: number
  totalBookingsChange: string | null
  pendingRequests: number
  pendingRequestsChange: string | null
  activeBookings: number
  activeBookingsChange: string | null
  completedBookings: number
  completedBookingsChange: string | null
  cancelledBookings: number
  cancelledBookingsChange: string | null
  totalFacilities: number
  registeredUsers: number
}

export interface FacilityUsageStat {
  facilityId: number
  facilityName: string
  bookingCount: number
  pct: number
}

export interface DashboardSummary {
  stats: DashboardStats
  facilityUsage: FacilityUsageStat[]
  recentBookings: Booking[]
}
