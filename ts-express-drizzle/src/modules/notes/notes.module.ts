import { notesController } from './notes.controller'
import { notesRepository } from './notes.repository'
import { notesRouter } from './notes.router'

export const notesModule = () => {
  const repository = notesRepository()
  const controller = notesController(repository)
  const router = notesRouter(controller)

  return router
}
