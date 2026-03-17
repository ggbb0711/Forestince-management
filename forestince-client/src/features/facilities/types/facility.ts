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
  status: string
  notes: string | null
  facilityId: number
  userId: string
  createdAt: string
  updatedAt: string
  facility: { id: number; name: string }
  user: { id: string; name: string; email: string; company: { name: string } }
}

export interface BookingFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}
