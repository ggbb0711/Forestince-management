import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { BookingFilters, BookingWithRelations, BookingsResponse } from '../types/booking'

const bookingInclude = {
  facility: true,
  user: {
    include: {
      company: true,
    },
  },
} satisfies Prisma.BookingInclude

export async function getBookings(filters: BookingFilters): Promise<BookingsResponse> {
  const {
    status,
    facilityId,
    userId,
    dateFrom,
    dateTo,
    search,
    page = 1,
    pageSize = 20,
  } = filters

  const where: Prisma.BookingWhereInput = {}

  if (status) where.status = status
  if (facilityId) (where as Record<string, unknown>).facilityId = parseInt(facilityId, 10)
  if (userId) where.userId = userId

  if (dateFrom || dateTo) {
    where.startTime = {}
    if (dateFrom) (where.startTime as Prisma.DateTimeFilter).gte = dateFrom
    if (dateTo) (where.startTime as Prisma.DateTimeFilter).lte = dateTo
  }

  if (search) {
    where.user = {
      name: {
        contains: search,
      },
    }
  }

  const skip = (page - 1) * pageSize

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { startTime: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ])

  return {
    data: bookings as unknown as BookingWithRelations[],
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

export async function getBookingById(id: string): Promise<BookingWithRelations | null> {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  return booking as unknown as BookingWithRelations | null
}
