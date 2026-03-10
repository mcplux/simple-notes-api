import { Request, Response } from 'express'
import { RegisterInput } from './auth.validation'

export const registerUser = (
  req: Request<{}, RegisterInput>,
  res: Response,
) => {
  res.json(req.body)
}
