export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type FacilityType = 'MEDITATION' | 'SPRING' | 'TRAIL' | 'GARDEN' | 'POD'

export interface BookingFilters {
  status?: BookingStatus
  facilityId?: string
  userId?: string
  dateFrom?: Date
  dateTo?: Date
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

export interface BookingsResponse {
  data: BookingWithRelations[]
  meta: PaginationMeta
}

export type BookingWithRelations = {
  id: string
  startTime: Date
  endTime: Date
  status: string
  notes: string | null
  facilityId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  facility: {
    id: string
    name: string
    type: string
    createdAt: Date
    updatedAt: Date
  }
  user: {
    id: string
    name: string
    email: string
    companyId: string
    createdAt: Date
    updatedAt: Date
    company: {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }
  }
}
