import { Request, Response } from 'express'
import { NotesRepository } from './notes.repository'
import { NoteInput, ParamsNote } from './dtos'
import { ApiResponse } from '../common/types/api-response.type'
import { Note } from './schemas/notes.schema'

export const notesController = (notesRepository: NotesRepository) => {
  const create = async (
    req: Request<{}, {}, NoteInput>,
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

  const update = async (
    req: Request<ParamsNote, {}, NoteInput>,
    res: Response<ApiResponse<{ note: Note }>>,
  ) => {
    const id = req.params.id
    const user = req.user!
    const note = await notesRepository.update(id, user.id, req.body)
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

  const remove = async (
    req: Request<ParamsNote>,
    res: Response<ApiResponse>,
  ) => {
    const id = req.params.id
    const user = req.user!
    const deleted = await notesRepository.deleteById(id, user.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Note not found',
      })
    }

    return res.status(200).json({
      success: true,
      status: 200,
    })
  }

  return {
    create,
    findMany,
    findOne,
    update,
    remove,
  }
}

export type NotesController = ReturnType<typeof notesController>
