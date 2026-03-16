import { Request, Response } from 'express'
import { NotesRepository } from './notes.repository'
import { CreateNoteInput, ParamsNote } from './dtos'

export const notesController = (notesRepository: NotesRepository) => {
  const create = async (
    req: Request<{}, {}, CreateNoteInput>,
    res: Response,
  ) => {
    const user = req.user!
    const note = await notesRepository.create({
      ...req.body,
      userId: user.id,
    })

    res.json(note)
  }

  const findMany = async (req: Request, res: Response) => {
    const user = req.user!
    const notes = await notesRepository.findMany(user.id, 20, 0)

    return res.status(200).json(notes)
  }

  const findOne = async (req: Request<ParamsNote>, res: Response) => {
    const id = req.params.id
    const user = req.user!
    const note = await notesRepository.findOneById(id, user.id)
    if (!note) {
      return res.status(404).json({
        error: `Note with id ${id} not found`,
      })
    }

    return res.status(200).json(note)
  }

  return {
    create,
    findMany,
    findOne,
  }
}

export type NotesController = ReturnType<typeof notesController>
