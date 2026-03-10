import { Router } from 'express'
import { getUser, login, registerUser } from './auth.controllers'
import { LoginSchema, RegisterSchema } from './auth.validation'
import { validateSchema } from '../common/middlewares/validate-schema'
import { auth } from './auth.middlewares'

const router = Router()

router.post('/register', validateSchema(RegisterSchema), registerUser)
router.post('/login', validateSchema(LoginSchema), login)
router.get('/me', auth, getUser)

export default router
