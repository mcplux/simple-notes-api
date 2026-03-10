import jwt from 'jsonwebtoken'

const JWT_SECRET = 'super_secret_string'

export interface JwtPayload {
  sub: number
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}
