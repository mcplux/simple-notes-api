import jwt from 'jsonwebtoken'
import { env } from '../../../config/env'

export interface JwtPayload {
  sub: string
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.get('JWT_SECRET'), { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, env.get('JWT_SECRET')) as unknown
  return payload as JwtPayload
}
