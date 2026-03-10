import { db } from '../../db'
import { NoteInsert, notesTable } from './notes.schemas'

export const createNote = async (data: NoteInsert) => {
  const [note] = await db.insert(notesTable).values(data).returning()

  return note
}
