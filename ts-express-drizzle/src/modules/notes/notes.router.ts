import { Router } from 'express'
import { NotesController } from './notes.controller'
import { validateSchema } from '../common/middlewares/validate-schema.middleware'
import { auth } from '../common/middlewares/auth.middleware'
import { createNoteSchema } from './dtos'

export const notesRouter = (notesController: NotesController) => {
  const router = Router()
  const namespace = '/notes'

  router.post(
    '/',
    auth,
    validateSchema(createNoteSchema),
    notesController.create,
  )

  return {
    router,
    namespace,
  }
}
