import type { ZodObject } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export function validate(schemas: { body?: ZodObject; query?: ZodObject; params?: ZodObject }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const location of ['params', 'query', 'body'] as const) {
      const schema = schemas[location]
      if (!schema) continue

      const result = schema.safeParse(req[location])
      if (!result.success) {
        const firstError = result.error.issues[0]
        res.status(400).json({ payload: null, message: firstError.message, isOk: false })
        return
      }

      (req as unknown as Record<string, unknown>)[location] = result.data
    }
    next()
  }
}
