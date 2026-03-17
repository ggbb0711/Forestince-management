import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { getFacilities, getFacilityById } from '../services/facilityService'
import { API_MESSAGES } from '../constants/messages'
import type { ApiResponse } from '../types/response'
import type { FacilityWithCount } from '../types/facility'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const facilities = await getFacilities()
    const { message, isOk } = API_MESSAGES.FACILITIES.LIST_OK
    return res.json({ payload: facilities, message, isOk })
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) {
    const { message, status, isOk } = API_MESSAGES.FACILITIES.INVALID_ID
    return res.status(status).json({ payload: null, message, isOk })
  }
  try {
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
})

export default router
