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
  facilityId: string
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

