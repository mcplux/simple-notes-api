import { Request, Response } from 'express'
import { NotesRepository } from './notes.repository'
import { CreateNoteInput } from './dtos'

export const notesController = (notesRepository: NotesRepository) => {
  const create = async (
    req: Request<{}, {}, CreateNoteInput>,
    res: Response,
  ) => {
    const user = req.user!
    const note = await notesRepository.createNote({
      ...req.body,
      userId: user.id,
    })

    res.json(note)
  }

  return {
    create,
  }
}

export type NotesController = ReturnType<typeof notesController>
