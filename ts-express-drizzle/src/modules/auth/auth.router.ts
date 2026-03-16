import { Router } from 'express'
import { validateSchema } from '../common/middlewares/validate-schema.middleware'
import { auth } from '../common/middlewares/auth.middleware'
import { AuthController } from './auth.controller'
import { loginDto, registerDto } from './dtos'

export const authRouter = (authController: AuthController) => {
  const router = Router()
  const namespace = '/auth'

  router.post('/register', validateSchema(registerDto), authController.register)
  router.post('/login', validateSchema(loginDto), authController.login)
  router.get('/me', auth, authController.getUser)

  return {
    router,
    namespace,
  }
}
