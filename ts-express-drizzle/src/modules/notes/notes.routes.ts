import { Router } from 'express'
import { createNoteSchema } from './notes.validation'
import { createNote } from './notes.controllers'
import { validateSchema } from '../common/middlewares/validate-schema'
import { auth } from '../auth/auth.middlewares'

const router = Router()

router.post('/', auth, validateSchema(createNoteSchema), createNote)

export default router
