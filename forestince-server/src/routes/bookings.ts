import { Router, Request, Response } from 'express'
import { getBookings, getBookingById } from '../services/bookingService'
import { BookingFilters, BookingStatus, BOOKING_STATUSES } from '../types/booking'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: BookingFilters = {}

    if (req.query.status) {
      const status = (req.query.status as string).toUpperCase()
      if (!BOOKING_STATUSES.includes(status as BookingStatus)) {
        return res.status(400).json({
          error: `Invalid status "${req.query.status}". Must be one of: ${BOOKING_STATUSES.join(', ')}`,
        })
      }
      filters.status = status as BookingStatus
    }

    if (req.query.facilityId) {
      filters.facilityId = req.query.facilityId as string
    }

    if (req.query.userId) {
      filters.userId = req.query.userId as string
    }

    if (req.query.dateFrom) {
      const date = new Date(req.query.dateFrom as string)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: `Invalid dateFrom: "${req.query.dateFrom}"` })
      }
      filters.dateFrom = date
    }

    if (req.query.dateTo) {
      const date = new Date(req.query.dateTo as string)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: `Invalid dateTo: "${req.query.dateTo}"` })
      }
      filters.dateTo = date
    }

    if (req.query.search) {
      filters.search = req.query.search as string
    }

    if (req.query.page) {
      const page = parseInt(req.query.page as string, 10)
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: 'Invalid page number' })
      }
      filters.page = page
    }

    if (req.query.pageSize) {
      const pageSize = parseInt(req.query.pageSize as string, 10)
      if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
        return res.status(400).json({ error: 'pageSize must be between 1 and 100' })
      }
      filters.pageSize = pageSize
    }

    const result = await getBookings(filters)
    return res.json(result)
  } catch (err) {
    console.error('GET /api/bookings error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await getBookingById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: `Booking with id "${req.params.id}" not found` })
    }
    return res.json({ data: booking })
  } catch (err) {
    console.error(`GET /api/bookings/${req.params.id} error:`, err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
