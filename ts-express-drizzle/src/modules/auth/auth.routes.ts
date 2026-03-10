import { Router } from 'express'
import { registerUser } from './auth.controllers'
import { RegisterSchema } from './auth.validation'
import { validateSchema } from '../common/middlewares/validate-schema'

const router = Router()

router.post('/register', validateSchema(RegisterSchema), registerUser)

export default router
