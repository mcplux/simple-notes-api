import { Request, Response } from 'express'
import { NotesRepository } from './notes.repository'
import { CreateNoteInput, ParamsNote } from './dtos'
import { ApiResponse } from '../common/types/api-response.type'
import { Note } from './schemas/notes.schema'

export const notesController = (notesRepository: NotesRepository) => {
  const create = async (
    req: Request<{}, {}, CreateNoteInput>,
    res: Response<ApiResponse<{ note: Note }>>,
  ) => {
    const user = req.user!
    const note = await notesRepository.create({
      ...req.body,
      userId: user.id,
    })

    res.status(201).json({
      success: true,
      status: 201,
      data: { note },
    })
  }

  const findMany = async (
    req: Request,
    res: Response<ApiResponse<{ notes: Note[] }>>,
  ) => {
    const user = req.user!
    const notes = await notesRepository.findMany(user.id, 20, 0)

    return res.status(200).json({
      success: true,
      status: 200,
      data: { notes },
    })
  }

  const findOne = async (
    req: Request<ParamsNote>,
    res: Response<ApiResponse<{ note: Note }>>,
  ) => {
    const id = req.params.id
    const user = req.user!
    const note = await notesRepository.findOneById(id, user.id)
    if (!note) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Note not found',
      })
    }

    return res.status(200).json({
      success: true,
      status: 200,
      data: { note },
    })
  }

  return {
    create,
    findMany,
    findOne,
  }
}

export type NotesController = ReturnType<typeof notesController>
