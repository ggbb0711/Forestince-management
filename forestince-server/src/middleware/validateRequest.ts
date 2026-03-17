import { validationResult } from 'express-validator'
import type { Request, Response, NextFunction } from 'express'

export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ payload: null, message: errors.array()[0].msg, isOk: false })
    return
  }
  next()
}
