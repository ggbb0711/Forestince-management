import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { param, query, matchedData } from 'express-validator'
import { getFacilityStats } from '../services/reportService'
import { API_MESSAGES } from '../constants/messages'
import { validateRequest } from '../middleware/validateRequest'
import type { FacilityStatBreakdown } from '../types/report'
import type { ApiResponse } from '../types/response'

const router = Router()

const validateFacilityStats = [
  param('id')
    .isInt({ min: 1 })
    .withMessage(API_MESSAGES.FACILITY_STATS.INVALID_ID.message)
    .toInt(),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('dateFrom must be a valid ISO date')
    .toDate(),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('dateTo must be a valid ISO date')
    .toDate(),
  validateRequest,
]

router.get(
  '/facility-stats/:id',
  validateFacilityStats,
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<FacilityStatBreakdown | null>>,
    next: NextFunction,
  ) => {
    try {
      const { id, dateFrom, dateTo } = matchedData<{ id: number; dateFrom?: Date; dateTo?: Date }>(req)
      const stats = await getFacilityStats(id, dateFrom, dateTo)
      if (!stats) {
        const { message, status, isOk } = API_MESSAGES.FACILITY_STATS.NOT_FOUND
        return res.status(status).json({ payload: null, message, isOk })
      }
      const { message, isOk } = API_MESSAGES.FACILITY_STATS.OK
      return res.json({ payload: stats, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

export default router
