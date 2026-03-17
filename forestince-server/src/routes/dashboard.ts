import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { query, matchedData } from 'express-validator'
import { getDashboardSummary } from '../services/dashboardService'
import { API_MESSAGES } from '../constants/messages'
import { type DashboardWindow, type DashboardSummary, VALID_WINDOWS } from '../types/dashboard'
import { validateRequest } from '../middleware/validateRequest'
import type { ApiResponse } from '../types/response'

const router = Router()

const validateDashboard = [
  query('window')
    .optional()
    .isIn(VALID_WINDOWS)
    .withMessage(API_MESSAGES.DASHBOARD.INVALID_WINDOW.message),
  validateRequest,
]

router.get(
  '/',
  validateDashboard,
  async (req: Request, res: Response<ApiResponse<DashboardSummary>>, next: NextFunction) => {
    const { window: w } = matchedData<{ window?: DashboardWindow }>(req, { locations: ['query'] })
    const win = w ?? '28d'
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
