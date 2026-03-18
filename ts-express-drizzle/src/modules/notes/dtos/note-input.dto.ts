import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const noteInputDto = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title is too long')
    .openapi({ example: 'My Note Title' }),

  content: z
    .string()
    .min(1, 'Content is required')
    .openapi({ example: 'My note content' }),
})

export type NoteInput = z.infer<typeof noteInputDto>
