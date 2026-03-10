import { Router } from 'express'
import { getUser, login, registerUser } from './auth.controllers'
import { loginSchema, registerSchema } from './auth.validation'
import { validateSchema } from '../common/middlewares/validate-schema'
import { auth } from './auth.middlewares'

const router = Router()

router.post('/register', validateSchema(registerSchema), registerUser)
router.post('/login', validateSchema(loginSchema), login)
router.get('/me', auth, getUser)

export default router
