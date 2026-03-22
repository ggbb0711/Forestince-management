import type { BookingWithRelations } from './booking'

export enum DashboardWindow {
  HOURS_24 = '24h',
  DAYS_7 = '7d',
  DAYS_28 = '28d',
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
  recentBookings: BookingWithRelations[]
}
