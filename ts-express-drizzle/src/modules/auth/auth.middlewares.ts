import { Request, Response, NextFunction } from 'express'
import { JwtPayload, verifyToken } from '../common/utils/jwt'
import * as authRepo from './auth.repository'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  try {
    const { sub } = verifyToken(token)
    const user = await authRepo.getUserById(sub)
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
