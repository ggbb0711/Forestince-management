import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { query } from 'express-validator'
import { getBookings, getBookingById } from '../services/bookingService'
import { API_MESSAGES } from '../constants/messages'
import { validateRequest } from '../middleware/validateRequest'
import type { BookingFilters, BookingsResponse, BookingWithRelations } from '../types/booking'

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
  validateRequest,
]

router.get('/', validateBookingQuery, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getBookings(req.query as unknown as BookingFilters)
    const { message, isOk } = API_MESSAGES.BOOKINGS.LIST_OK
    return res.json({ payload: result, message, isOk })
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await getBookingById(req.params.id)
    if (!booking) {
      const { message, status, isOk } = API_MESSAGES.BOOKINGS.NOT_FOUND
      return res.status(status).json({ payload: null, message, isOk })
    }
    const { message, isOk } = API_MESSAGES.BOOKINGS.FOUND
    return res.json({ payload: booking, message, isOk })
  } catch (err) {
    return next(err)
  }
})

export default router
