import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { param, matchedData } from 'express-validator'
import { getFacilities, getFacilityById } from '../services/facilityService'
import { API_MESSAGES } from '../constants/messages'
import { validateRequest } from '../middleware/validateRequest'
import type { FacilityWithCount } from '../types/facility'
import type { ApiResponse } from '../types/response'

const router = Router()

const validateFacilityId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage(API_MESSAGES.FACILITIES.INVALID_ID.message)
    .toInt(),
  validateRequest,
]

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
  validateFacilityId,
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<FacilityWithCount | null>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = matchedData<{ id: number }>(req)
      const facility = await getFacilityById(id)
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
