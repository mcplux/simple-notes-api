import { NextFunction, Request, Response } from 'express'
import { ZodType, z } from 'zod'

export const validateSchema = (
  schema: ZodType,
  property: 'body' | 'params' = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[property])
    if (!parsed.success) {
      const flattenedErrors = z.flattenError(parsed.error)
      return res.status(400).json({
        details: flattenedErrors.fieldErrors,
      })
    }

    req[property] = parsed.data
    next()
  }
}
