import { UserResponse } from './modules/auth/auth.schemas'

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse
    }
  }
}

export {}
