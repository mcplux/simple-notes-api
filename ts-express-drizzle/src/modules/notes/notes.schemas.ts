import { timestamp, pgTable, varchar, uuid, text } from 'drizzle-orm/pg-core'
import { usersTable } from '../auth/auth.schemas'

export const notesTable = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('name', { length: 255 }).notNull(),
  content: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id').references(() => usersTable.id, {
    onDelete: 'cascade',
  }),
})

export type Note = typeof notesTable.$inferSelect
