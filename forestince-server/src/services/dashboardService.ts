import prisma from '../lib/prisma'
import { DashboardWindow } from '../types/dashboard'
import type { DashboardStats, FacilityUsageStat } from '../types/dashboard'

const WINDOW_MS: Record<DashboardWindow, number> = {
  [DashboardWindow.HOURS_24]: 24 * 60 * 60 * 1000,
  [DashboardWindow.DAYS_7]:   7 * 24 * 60 * 60 * 1000,
  [DashboardWindow.DAYS_28]:  28 * 24 * 60 * 60 * 1000,
}

function formatChange(current: number, previous: number): string | null {
  if (previous === 0) return current > 0 ? 'New' : null
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return null
  return pct > 0 ? `+${pct}%` : `${pct}%`
}

export async function getDashboardStats(window: DashboardWindow = DashboardWindow.DAYS_28): Promise<DashboardStats> {
  const windowMs    = WINDOW_MS[window]
  const windowStart = new Date(Date.now() - windowMs)
  const prevStart   = new Date(Date.now() - 2 * windowMs)

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
  ] = await Promise.all([
    prisma.booking.count({ where: { startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'PENDING',   startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'CONFIRMED', startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'COMPLETED', startTime: { gte: windowStart } } }),
    prisma.booking.count({ where: { status: 'CANCELLED', startTime: { gte: windowStart } } }),

    prisma.booking.count({ where: { startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'PENDING',   startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'CONFIRMED', startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'COMPLETED', startTime: { gte: prevStart, lt: windowStart } } }),
    prisma.booking.count({ where: { status: 'CANCELLED', startTime: { gte: prevStart, lt: windowStart } } }),

    prisma.facility.count(),
    prisma.user.count(),
  ])

  return {
    totalBookings,
    totalBookingsChange:     formatChange(totalBookings,     prevTotalBookings),
    pendingRequests,
    pendingRequestsChange:   formatChange(pendingRequests,   prevPendingRequests),
    activeBookings,
    activeBookingsChange:    formatChange(activeBookings,    prevActiveBookings),
    completedBookings,
    completedBookingsChange: formatChange(completedBookings, prevCompletedBookings),
    cancelledBookings,
    cancelledBookingsChange: formatChange(cancelledBookings, prevCancelledBookings),
    totalFacilities,
    registeredUsers,
  }
}

export async function getDashboardUsage(window: DashboardWindow = DashboardWindow.DAYS_28): Promise<FacilityUsageStat[]> {
  const windowStart = new Date(Date.now() - WINDOW_MS[window])

  const [facilityGroups, facilitiesAll] = await Promise.all([
    prisma.booking.groupBy({
      by: ['facilityId'],
      where: { startTime: { gte: windowStart } },
      _count: { id: true },
    }),
    prisma.facility.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  const facilityNameMap = new Map(facilitiesAll.map(f => [f.id, f.name]))
  const maxCount = Math.max(...facilityGroups.map(g => g._count.id), 1)

  return facilityGroups
    .map(g => ({
      facilityId: g.facilityId,
      facilityName: facilityNameMap.get(g.facilityId) ?? 'Unknown',
      bookingCount: g._count.id,
      pct: Math.round((g._count.id / maxCount) * 100),
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
}
