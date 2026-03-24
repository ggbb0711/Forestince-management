import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { BookingFilters, BookingWithRelations, BookingsResponse, CreateBookingInput } from '../types/booking'
import { API_MESSAGES } from '../constants/messages'
import { WORKING_HOURS, MIN_BOOKING_DURATION_HOURS } from '../constants/workingHours'
import { AppError } from '../errors/AppError'

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
    data: bookings as BookingWithRelations[],
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

  return booking as BookingWithRelations | null
}

export async function createBooking(input: CreateBookingInput): Promise<BookingWithRelations> {
  const { facilityId, userId, startTime, endTime, notes } = input

  const now = new Date()
  if (startTime <= now) {
    const { message, status } = API_MESSAGES.BOOKINGS.START_IN_PAST
    throw new AppError(message, status)
  }

  if (endTime <= startTime) {
    const { message, status } = API_MESSAGES.BOOKINGS.END_BEFORE_START
    throw new AppError(message, status)
  }

  const durationMs = endTime.getTime() - startTime.getTime()
  if (durationMs < MIN_BOOKING_DURATION_HOURS * 60 * 60 * 1000) {
    const { message, status } = API_MESSAGES.BOOKINGS.MIN_DURATION
    throw new AppError(message, status)
  }

  const startHour = startTime.getHours()
  const endHour = endTime.getHours()
  if (startHour < WORKING_HOURS.startHour || endHour > WORKING_HOURS.endHour) {
    const { message, status } = API_MESSAGES.BOOKINGS.OUTSIDE_WORKING_HOURS
    throw new AppError(message, status)
  }

  const facility = await prisma.facility.findUnique({ where: { id: facilityId } })
  if (!facility) {
    const { message, status } = API_MESSAGES.BOOKINGS.FACILITY_NOT_FOUND
    throw new AppError(message, status)
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    const { message, status } = API_MESSAGES.BOOKINGS.USER_NOT_FOUND
    throw new AppError(message, status)
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      facilityId,
      status: { notIn: ['CANCELLED'] },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  })
  if (conflict) {
    const { message, status } = API_MESSAGES.BOOKINGS.OVERLAPPING_TIME
    throw new AppError(message, status)
  }

  const booking = await prisma.booking.create({
    data: {
      facilityId,
      userId,
      startTime,
      endTime,
      notes,
      status: 'PENDING',
    },
    include: bookingInclude,
  })

  return booking as BookingWithRelations
}
