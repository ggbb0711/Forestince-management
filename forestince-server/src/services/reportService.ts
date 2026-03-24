import dayjs from '../lib/dayjs'
import prisma from '../lib/prisma'
import type { FacilityStatBreakdown, TopBooker, DailyUsage } from '../types/report'

function getDefaultDateRange(): { dateFrom: Date; dateTo: Date } {
  const now = dayjs.utc()
  return {
    dateFrom: now.startOf('month').toDate(),
    dateTo: now.toDate(),
  }
}

function toISODateString(d: Date): string {
  return dayjs.utc(d).format('YYYY-MM-DD')
}


export async function getFacilityStats(
  facilityId: number,
  dateFrom?: Date,
  dateTo?: Date
): Promise<FacilityStatBreakdown | null> {
  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { id: true, name: true },
  })
  if (!facility) return null

  const defaults = getDefaultDateRange()
  const from = dateFrom ?? defaults.dateFrom
  const to = dateTo ?? defaults.dateTo

  const where = {
    facilityId,
    startTime: { gte: from, lte: to },
  }

  const [totalBookings, confirmed, pending, cancelled, completed, bookerGroups, rawBookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { ...where, status: 'PENDING' } }),
    prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
    prisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
    prisma.booking.groupBy({
      by: ['userId'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.booking.findMany({
      where,
      select: { startTime: true },
    }),
  ])

  const userIds = bookerGroups.map(g => g.userId)
  const users = userIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        include: { company: true },
      })
    : []

  const userMap = new Map(users.map(u => [u.id, u]))

  const topBookers: TopBooker[] = bookerGroups
    .map(g => {
      const u = userMap.get(g.userId)
      return {
        rank: 0,
        userId: g.userId,
        userName: u?.name ?? 'Unknown',
        companyName: u?.company?.name ?? 'Unknown',
        bookingCount: g._count.id,
      }
    })
    .sort((a, b) => b.bookingCount - a.bookingCount || a.userName.localeCompare(b.userName))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const dailyMap = new Map<string, number>()
  for (const b of rawBookings) {
    const date = toISODateString(new Date(b.startTime))
    dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1)
  }

  const dailyUsage: DailyUsage[] = []
  let cursor = dayjs.utc(from)
  const end = dayjs.utc(to)
  while (!cursor.isAfter(end)) {
    const dateStr = cursor.format('YYYY-MM-DD')
    dailyUsage.push({ date: dateStr, count: dailyMap.get(dateStr) ?? 0 })
    cursor = cursor.add(1, 'day')
  }

  const utilizationRate = totalBookings > 0
    ? Math.round(((confirmed + completed) / totalBookings) * 100)
    : 0

  return {
    facilityId: facility.id,
    facilityName: facility.name,
    totalBookings,
    confirmed,
    pending,
    cancelled,
    completed,
    utilizationRate,
    dateFrom: toISODateString(from),
    dateTo: toISODateString(to),
    topBookers,
    dailyUsage,
  }
}


