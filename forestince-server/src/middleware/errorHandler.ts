import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { AppError } from '../errors/AppError'
import { API_MESSAGES } from '../constants/messages'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ payload: null, message: err.message, isOk: err.isOk })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      const { status, message, isOk } = API_MESSAGES.GENERAL.RECORD_NOT_FOUND
      res.status(status).json({ payload: null, message, isOk })
      return
    }
    const { status, message, isOk } = API_MESSAGES.GENERAL.DB_CONSTRAINT_ERROR
    res.status(status).json({ payload: null, message, isOk })
    return
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const { status, message, isOk } = API_MESSAGES.GENERAL.INVALID_DATA_PROVIDED
    res.status(status).json({ payload: null, message, isOk })
    return
  }

  console.error('Unhandled error:', err)
  const { status, message, isOk } = API_MESSAGES.GENERAL.INTERNAL_ERROR
  res.status(status).json({ payload: null, message, isOk })
}
