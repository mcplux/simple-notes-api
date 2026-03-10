import jwt from 'jsonwebtoken'

const JWT_SECRET = 'super_secret_string'

export interface JwtPayload {
  sub: string
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as unknown
  return payload as JwtPayload
}
