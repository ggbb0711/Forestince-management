import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getFacilityStats } from '../services/reportService'
import { API_MESSAGES } from '../constants/messages'
import { validate } from '../middleware/validateRequest'
import type { FacilityStatBreakdown } from '../types/report'
import type { ApiResponse } from '../types/response'

const router = Router()

const facilityStatsParamsSchema = z.object({
  id: z.coerce.number().int().min(1, { message: API_MESSAGES.FACILITY_STATS.INVALID_ID.message }),
})

const facilityStatsQuerySchema = z.object({
  dateFrom: z.coerce.date({ message: API_MESSAGES.FACILITY_STATS.INVALID_DATE.message }).optional(),
  dateTo: z.coerce.date({ message: API_MESSAGES.FACILITY_STATS.INVALID_DATE.message }).optional(),
})

router.get(
  '/facility-stats/:id',
  validate({ params: facilityStatsParamsSchema, query: facilityStatsQuerySchema }),
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<FacilityStatBreakdown | null>>,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id)
      const { dateFrom, dateTo } = req.query as z.infer<typeof facilityStatsQuerySchema>
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
