import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { query, body, matchedData } from 'express-validator'
import { getBookings, getBookingById, createBooking } from '../services/bookingService'
import { API_MESSAGES } from '../constants/messages'
import { validateRequest } from '../middleware/validateRequest'
import type { BookingFilters, BookingsResponse, BookingWithRelations, CreateBookingInput } from '../types/booking'
import type { ApiResponse } from '../types/response'

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

const validateCreateBooking = [
  body('facilityId').isInt({ min: 1 }).withMessage('facilityId must be a positive integer').toInt(),
  body('userId').isString().notEmpty().withMessage('userId is required'),
  body('startTime').isISO8601().withMessage('startTime must be a valid ISO8601 datetime').toDate(),
  body('endTime').isISO8601().withMessage('endTime must be a valid ISO8601 datetime').toDate(),
  body('notes').optional().isString().isLength({ max: 500 }).withMessage('notes must be 500 characters or fewer'),
  validateRequest,
]

router.get(
  '/',
  validateBookingQuery,
  async (req: Request, res: Response<ApiResponse<BookingsResponse>>, next: NextFunction) => {
    try {
      const filters = matchedData<BookingFilters & { timezone?: string }>(req, { locations: ['query'] })
      const result = await getBookings(filters)
      const { message, isOk } = API_MESSAGES.BOOKINGS.LIST_OK
      return res.json({ payload: result, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

router.post(
  '/',
  validateCreateBooking,
  async (
    req: Request,
    res: Response<ApiResponse<BookingWithRelations>>,
    next: NextFunction,
  ) => {
    try {
      const data = matchedData<CreateBookingInput>(req, { locations: ['body'] })
      const booking = await createBooking(data)
      const { message, isOk, status } = API_MESSAGES.BOOKINGS.CREATED
      return res.status(status).json({ payload: booking, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

router.get(
  '/:id',
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<BookingWithRelations | null>>,
    next: NextFunction,
  ) => {
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
  },
)

export default router
