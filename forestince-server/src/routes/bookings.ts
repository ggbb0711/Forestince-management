import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getBookings, getBookingById } from '../services/bookingService'
import { API_MESSAGES } from '../constants/messages'
import { validate } from '../middleware/validateRequest'
import { BookingStatus } from '../types/booking'
import type { BookingFilters, BookingsResponse, BookingWithRelations } from '../types/booking'
import type { ApiResponse } from '../types/response'

const router = Router()

const bookingQuerySchema = z.object({
  status: z
    .string()
    .transform((s) => s.toUpperCase())
    .pipe(
      z.enum(BookingStatus, { error: API_MESSAGES.BOOKINGS.INVALID_STATUS.message }),
    )
    .optional(),
  facilityId: z.string().optional(),
  userId: z.string().optional(),
  dateFrom: z.coerce.date({ message: API_MESSAGES.BOOKINGS.INVALID_DATE.message }).optional(),
  dateTo: z.coerce.date({ message: API_MESSAGES.BOOKINGS.INVALID_DATE.message }).optional(),
  search: z.string().optional(),
  page: z.coerce
    .number({ message: API_MESSAGES.BOOKINGS.INVALID_PAGE.message })
    .int()
    .min(1, { message: API_MESSAGES.BOOKINGS.INVALID_PAGE.message })
    .optional(),
  pageSize: z.coerce
    .number({ message: API_MESSAGES.BOOKINGS.INVALID_PAGE_SIZE.message })
    .int()
    .min(1, { message: API_MESSAGES.BOOKINGS.INVALID_PAGE_SIZE.message })
    .max(100, { message: API_MESSAGES.BOOKINGS.INVALID_PAGE_SIZE.message })
    .optional(),
})

router.get(
  '/',
  validate({ query: bookingQuerySchema }),
  async (req: Request, res: Response<ApiResponse<BookingsResponse>>, next: NextFunction) => {
    try {
      const filters = req.query as BookingFilters
      const result = await getBookings(filters)
      const { message, isOk } = API_MESSAGES.BOOKINGS.LIST_OK
      return res.json({ payload: result, message, isOk })
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
