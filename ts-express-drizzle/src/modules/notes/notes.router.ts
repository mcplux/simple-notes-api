import { Router } from 'express'
import { NotesController } from './notes.controller'
import { validateSchema } from '../common/middlewares/validate-schema.middleware'
import { auth } from '../common/middlewares/auth.middleware'
import { createNoteSchema, paramsNoteDto } from './dtos'

export const notesRouter = (notesController: NotesController) => {
  const router = Router()
  const namespace = '/notes'

  router.post(
    '/',
    auth,
    validateSchema(createNoteSchema),
    notesController.create,
  )

  router.get('/', auth, notesController.findMany)

  router.get(
    '/:id',
    auth,
    validateSchema(paramsNoteDto, 'params'),
    notesController.findOne,
  )

  return {
    router,
    namespace,
  }
}
