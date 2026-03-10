import { User } from './modules/auth/auth.schemas'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export {}
