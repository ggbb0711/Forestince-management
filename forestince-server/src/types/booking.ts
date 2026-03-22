import type { PaginationMeta } from './pagination'

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

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
  facilityId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  facility: {
    id: string
    name: string
    facilityIcon: string
    createdAt: Date
    updatedAt: Date
  }
  user: {
    id: string
    name: string
    email: string
    companyName: string
    createdAt: Date
    updatedAt: Date
  }
}
