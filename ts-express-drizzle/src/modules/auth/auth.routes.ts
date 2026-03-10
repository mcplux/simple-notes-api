import { Router } from 'express'
import { login, registerUser } from './auth.controllers'
import { LoginSchema, RegisterSchema } from './auth.validation'
import { validateSchema } from '../common/middlewares/validate-schema'

const router = Router()

router.post('/register', validateSchema(RegisterSchema), registerUser)
router.post('/login', validateSchema(LoginSchema), login)

export default router
