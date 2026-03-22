import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { BookingFilters, BookingWithRelations, BookingsResponse } from '../types/booking'

const bookingInclude = {
  facility: true,
  user: true,
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
  if (facilityId) where.facilityId = facilityId
  if (userId) where.userId = userId

  if (dateFrom || dateTo) {
    where.startTime = {}
    if (dateFrom) where.startTime.gte = dateFrom
    if (dateTo) where.startTime.lte = dateTo
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
    data: bookings,
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

  return booking
}
