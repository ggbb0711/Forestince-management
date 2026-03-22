import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getDashboardStats, getDashboardUsage } from '../services/dashboardService'
import { API_MESSAGES } from '../constants/messages'
import { DashboardWindow, type DashboardStats, type FacilityUsageStat } from '../types/dashboard'
import { validate } from '../middleware/validateRequest'
import type { ApiResponse } from '../types/response'

const router = Router()

const dashboardQuerySchema = z.object({
  window: z
    .enum(DashboardWindow, { error: API_MESSAGES.DASHBOARD.INVALID_WINDOW.message })
    .optional(),
})

router.get(
  '/stats',
  validate({ query: dashboardQuerySchema }),
  async (req: Request, res: Response<ApiResponse<DashboardStats>>, next: NextFunction) => {
    const { window: w } = req.query as z.infer<typeof dashboardQuerySchema>
    try {
      const stats = await getDashboardStats(w ?? DashboardWindow.DAYS_28)
      const { message, isOk } = API_MESSAGES.DASHBOARD.OK
      return res.json({ payload: stats, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

router.get(
  '/usage',
  validate({ query: dashboardQuerySchema }),
  async (req: Request, res: Response<ApiResponse<FacilityUsageStat[]>>, next: NextFunction) => {
    const { window: w } = req.query as z.infer<typeof dashboardQuerySchema>
    try {
      const usage = await getDashboardUsage(w ?? DashboardWindow.DAYS_28)
      const { message, isOk } = API_MESSAGES.DASHBOARD.OK
      return res.json({ payload: usage, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

export default router
