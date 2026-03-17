import { UserResponse } from './modules/auth/dtos'

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse
    }
  }
}

export {}
