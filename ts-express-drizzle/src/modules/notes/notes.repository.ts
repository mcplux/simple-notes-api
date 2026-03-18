import { and, eq } from 'drizzle-orm'
import { db } from '../../config/database'
import { Note, NoteInsert, notesTable } from './schemas/notes.schema'

export const notesRepository = () => {
  const create = async (data: NoteInsert): Promise<Note> => {
    const [note] = await db.insert(notesTable).values(data).returning()

    return note
  }

  const findMany = async (
    userId: Note['userId'],
    limit: number,
    offset: number,
  ): Promise<Note[]> => {
    if (!userId) {
      return []
    }

    return db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, userId))
      .limit(limit)
      .offset(offset)
  }

  const findOneById = async (
    id: Note['id'],
    userId: Note['userId'],
  ): Promise<Note | null> => {
    if (!userId) {
      return null
    }

    const [note] = await db
      .select()
      .from(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .limit(1)

    return note ?? null
  }

  const update = async (
    id: Note['id'],
    userId: Note['userId'],
    data: NoteInsert,
  ): Promise<Note | null> => {
    if (!userId) {
      return null
    }

    const [note] = await db
      .update(notesTable)
      .set(data)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning()

    return note ?? null
  }

  const deleteById = async (
    id: Note['id'],
    userId: Note['userId'],
  ): Promise<boolean> => {
    if (!userId) {
      return false
    }

    const result = await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning({ id: notesTable.id })

    return result.length > 0
  }

  return {
    create,
    findMany,
    findOneById,
    update,
    deleteById,
  }
}

export type NotesRepository = ReturnType<typeof notesRepository>
