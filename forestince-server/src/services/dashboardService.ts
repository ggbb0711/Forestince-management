import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import type { DashboardWindow, DashboardSummary, DashboardStats, FacilityUsageStat } from '../types/dashboard'
import type { BookingWithRelations } from '../types/booking'

const WINDOW_MS: Record<DashboardWindow, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d':  7 * 24 * 60 * 60 * 1000,
  '28d': 28 * 24 * 60 * 60 * 1000,
}

const bookingInclude = {
  facility: true,
  user: { include: { company: true } },
} satisfies Prisma.BookingInclude

function formatChange(current: number, previous: number): string | null {
  if (previous === 0) return current > 0 ? 'New' : null
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return null
  return pct > 0 ? `+${pct}%` : `${pct}%`
}

export async function getDashboardSummary(window: DashboardWindow = '28d'): Promise<DashboardSummary> {
  const windowMs     = WINDOW_MS[window]
  const windowStart  = new Date(Date.now() - windowMs)
  const prevStart    = new Date(Date.now() - 2 * windowMs)

  const [
    totalBookings,
    pendingRequests,
    activeBookings,
    completedBookings,
    cancelledBookings,
    prevTotalBookings,
    prevPendingRequests,
    prevActiveBookings,
    prevCompletedBookings,
    prevCancelledBookings,
    totalFacilities,
    registeredUsers,
    facilityGroups,
    facilitiesAll,
    recentBookingsRaw,
  ] = await Promise.all([

    prisma.booking.count({ where: { startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'PENDING',    startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'CONFIRMED',  startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'COMPLETED',  startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'CANCELLED',  startTime: { gte: windowStart } } }),

    prisma.booking.count({ where: { startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'PENDING',    startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'CONFIRMED',  startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'COMPLETED',  startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'CANCELLED',  startTime: { gte: prevStart, lt: windowStart } } }),

    prisma.facility.count(),
    prisma.user.count(),

    prisma.booking.groupBy({
      by: ['facilityId'],
      where: { startTime: { gte: windowStart } },
      _count: { id: true },
    }),
    prisma.facility.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),

    prisma.booking.findMany({
      where: { startTime: { gte: windowStart } },
      include: bookingInclude,
      orderBy: { startTime: 'desc' },
      take: 5,
    }),
  ])

  const stats: DashboardStats = {
    totalBookings,
    totalBookingsChange: formatChange(totalBookings,    prevTotalBookings),
    pendingRequests,
    pendingRequestsChange: formatChange(pendingRequests,  prevPendingRequests),
    activeBookings,
    activeBookingsChange: formatChange(activeBookings,   prevActiveBookings),
    completedBookings,
    completedBookingsChange: formatChange(completedBookings, prevCompletedBookings),
    cancelledBookings,
    cancelledBookingsChange: formatChange(cancelledBookings, prevCancelledBookings),
    totalFacilities,
    registeredUsers,
  }

  const facilityNameMap = new Map(facilitiesAll.map(f => [f.id, f.name]))
  const maxCount = Math.max(...facilityGroups.map(g => g._count.id), 1)

  const facilityUsage: FacilityUsageStat[] = facilityGroups
    .map(g => ({
      facilityId: g.facilityId,
      facilityName: facilityNameMap.get(g.facilityId) ?? 'Unknown',
      bookingCount: g._count.id,
      pct: Math.round((g._count.id / maxCount) * 100),
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)

  return {
    stats,
    facilityUsage,
    recentBookings: recentBookingsRaw as unknown as BookingWithRelations[],
  }
}
