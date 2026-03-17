import type { BookingStatus } from '../../../lib/bookingStatus'

export interface TopBooker {
  rank: number
  userId: string
  userName: string
  companyName: string
  bookingCount: number
}

export interface DailyUsage {
  date: string
  count: number
}

export interface FacilityStatBreakdown {
  facilityId: number
  facilityName: string
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  completed: number
  utilizationRate: number
  dateFrom: string
  dateTo: string
  topBookers: TopBooker[]
  dailyUsage: DailyUsage[]
}

export interface Facility {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  _count: { bookings: number }
}

export interface FacilityBooking {
  id: string
  startTime: string
  endTime: string
  status: BookingStatus
  notes: string | null
  facilityId: number
  userId: string
  createdAt: string
  updatedAt: string
  facility: { id: number; name: string }
  user: { id: string; name: string; email: string; company: { name: string } }
}

export interface BookingFilters {
  status?: BookingStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  pageSize?: number
}

