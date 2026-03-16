import { authController } from './auth.controller'
import { authRepository } from './auth.repository'
import { authRouter } from './auth.router'

export const authModule = () => {
  const repository = authRepository()
  const controller = authController(repository)
  const router = authRouter(controller)

  return router
}
