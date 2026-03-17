import { Router, Request, Response } from 'express'
import { query, validationResult } from 'express-validator'
import { getBookings, getBookingById } from '../services/bookingService'
import { BookingFilters } from '../types/booking'

const router = Router()

const validateBookingQuery = [
  query('status')
    .optional()
    .toUpperCase()
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .withMessage('Must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED'),
  query('facilityId').optional().isString(),
  query('userId').optional().isString(),
  query('dateFrom').optional().isISO8601().withMessage('Must be a valid ISO date').toDate(),
  query('dateTo').optional().isISO8601().withMessage('Must be a valid ISO date').toDate(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }).withMessage('Must be a positive integer').toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('Must be between 1 and 100').toInt(),
]

router.get('/', validateBookingQuery, async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map((e) => e.msg).join('; ') })
  }

  try {
    const result = await getBookings(req.query as unknown as BookingFilters)
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
