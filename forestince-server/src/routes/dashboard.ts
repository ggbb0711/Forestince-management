import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { query } from 'express-validator'
import { getDashboardSummary } from '../services/dashboardService'
import { API_MESSAGES } from '../constants/messages'
import { type DashboardWindow, VALID_WINDOWS } from '../types/dashboard'
import { validateRequest } from '../middleware/validateRequest'

const router = Router()

const validateDashboard = [
  query('window')
    .optional()
    .isIn(VALID_WINDOWS)
    .withMessage(API_MESSAGES.DASHBOARD.INVALID_WINDOW.message),
  validateRequest,
]

router.get('/', validateDashboard, async (req: Request, res: Response, next: NextFunction) => {
  const window = ((req.query.window as DashboardWindow | undefined) ?? '28d')
  try {
    const summary = await getDashboardSummary(window)
    const { message, isOk } = API_MESSAGES.DASHBOARD.OK
    return res.json({ payload: summary, message, isOk })
  } catch (err) {
    return next(err)
  }
})

export default router
