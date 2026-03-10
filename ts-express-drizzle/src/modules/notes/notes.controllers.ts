import { Request, Response } from 'express'
import { CreateNoteInput } from './notes.validation'
import * as notesRepo from './notes.repository'

export const createNote = async (
  req: Request<{}, {}, CreateNoteInput>,
  res: Response,
) => {
  const user = req.user!
  const note = await notesRepo.createNote({ ...req.body, userId: user.id })
  res.json(note)
}
