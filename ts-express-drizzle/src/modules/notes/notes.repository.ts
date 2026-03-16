import { db } from '../../db'
import { NoteInsert, notesTable } from './schemas/notes.schema'

export const notesRepository = () => {
  const createNote = async (data: NoteInsert) => {
    const [note] = await db.insert(notesTable).values(data).returning()

    return note
  }

  return {
    createNote,
  }
}

export type NotesRepository = ReturnType<typeof notesRepository>
