import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getDashboardSummary } from '../services/dashboardService'
import { API_MESSAGES } from '../constants/messages'
import { DashboardWindow, type DashboardSummary } from '../types/dashboard'
import { validate } from '../middleware/validateRequest'
import type { ApiResponse } from '../types/response'

const router = Router()

const dashboardQuerySchema = z.object({
  window: z
    .enum(DashboardWindow, { error: API_MESSAGES.DASHBOARD.INVALID_WINDOW.message })
    .optional(),
})

router.get(
  '/',
  validate({ query: dashboardQuerySchema }),
  async (req: Request, res: Response<ApiResponse<DashboardSummary>>, next: NextFunction) => {
    const { window: w } = req.query as z.infer<typeof dashboardQuerySchema>
    const win = w ?? DashboardWindow.DAYS_28
    try {
      const summary = await getDashboardSummary(win)
      const { message, isOk } = API_MESSAGES.DASHBOARD.OK
      return res.json({ payload: summary, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

export default router
