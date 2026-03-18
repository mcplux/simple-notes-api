import { Router } from 'express'
import { NotesController } from './notes.controller'
import { validateSchema } from '../common/middlewares/validate-schema.middleware'
import { auth } from '../common/middlewares/auth.middleware'
import { noteInputDto, paramsNoteDto } from './dtos'

export const notesRouter = (notesController: NotesController) => {
  const router = Router()
  const namespace = '/notes'

  router.post('/', auth, validateSchema(noteInputDto), notesController.create)

  router.get('/', auth, notesController.findMany)

  router.get(
    '/:id',
    auth,
    validateSchema(paramsNoteDto, 'params'),
    notesController.findOne,
  )

  router.put(
    '/:id',
    auth,
    validateSchema(paramsNoteDto, 'params'),
    validateSchema(noteInputDto),
    notesController.update,
  )

  router.delete(
    '/:id',
    auth,
    validateSchema(paramsNoteDto, 'params'),
    notesController.remove,
  )

  return {
    router,
    namespace,
  }
}
