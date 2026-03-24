import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { query, matchedData } from 'express-validator'
import { searchUsers } from '../services/userService'
import { API_MESSAGES } from '../constants/messages'
import { validateRequest } from '../middleware/validateRequest'
import type { UserSearchResult } from '../types/user'
import type { ApiResponse } from '../types/response'

const router = Router()

const validateSearchQuery = [
  query('search').optional().isString(),
  validateRequest,
]

router.get(
  '/',
  validateSearchQuery,
  async (
    req: Request,
    res: Response<ApiResponse<UserSearchResult[]>>,
    next: NextFunction,
  ) => {
    try {
      const { search = '' } = matchedData<{ search?: string }>(req, { locations: ['query'] })
      const users = await searchUsers(search)
      const { message, isOk } = API_MESSAGES.USERS.LIST_OK
      return res.json({ payload: users, message, isOk })
    } catch (err) {
      return next(err)
    }
  },
)

export default router
