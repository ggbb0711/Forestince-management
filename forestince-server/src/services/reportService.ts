import prisma from '../lib/prisma'
import type { FacilityStatBreakdown, TopBooker, DailyUsage } from '../types/report'

function getDefaultDateRange(): { dateFrom: Date; dateTo: Date } {
  const now = new Date()
  const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  const dateTo = new Date(now)
  return { dateFrom, dateTo }
}

function toISODateString(d: Date): string {
  return d.toISOString().split('T')[0]
}


export async function getFacilityStats(
  facilityId: string,
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
        companyName: u?.companyName ?? 'Unknown',
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
  for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const dateStr = toISODateString(new Date(d))
    dailyUsage.push({ date: dateStr, count: dailyMap.get(dateStr) ?? 0 })
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


