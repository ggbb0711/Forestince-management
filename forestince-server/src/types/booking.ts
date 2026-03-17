import type { PaginationMeta } from './pagination'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

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
  facilityId: number
  userId: string
  createdAt: Date
  updatedAt: Date
  facility: {
    id: number
    name: string
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
