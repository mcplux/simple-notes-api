import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title is too long'),

  content: z.string().min(1, 'Content is required'),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>
