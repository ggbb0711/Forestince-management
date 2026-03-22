import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { getFacilities, getFacilityById } from '../services/facilityService'
import { API_MESSAGES } from '../constants/messages'
import { validate } from '../middleware/validateRequest'
import type { FacilityWithCount } from '../types/facility'
import type { ApiResponse } from '../types/response'

const router = Router()

const facilityParamsSchema = z.object({
  id: z.string().min(1, { message: API_MESSAGES.FACILITIES.INVALID_ID.message }),
})

router.get('/', async (_req: Request, res: Response<ApiResponse<FacilityWithCount[]>>, next: NextFunction) => {
  try {
    const facilities = await getFacilities()
    const { message, isOk } = API_MESSAGES.FACILITIES.LIST_OK
    return res.json({ payload: facilities, message, isOk })
  } catch (err) {
    return next(err)
  }
})

router.get(
  '/:id',
  validate({ params: facilityParamsSchema }),
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<FacilityWithCount | null>>,
    next: NextFunction,
  ) => {
    try {
      const facility = await getFacilityById(req.params.id)
      if (!facility) {
        const { message, status, isOk } = API_MESSAGES.FACILITIES.NOT_FOUND
        return res.status(status).json({ payload: null, message, isOk })
      }
      const { message, isOk } = API_MESSAGES.FACILITIES.FOUND
      return res.json({ payload: facility, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

export default router
