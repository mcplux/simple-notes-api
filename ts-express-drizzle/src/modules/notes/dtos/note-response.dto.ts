import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const noteResponseDto = z.object({
  id: z.uuid(),
  title: z.string().openapi({ example: 'My Note Title' }),
  content: z.string().openapi({ example: 'My note content' }),
  createdAt: z.string().openapi({ example: '2026-03-18T00:00:00.000Z' }),
  updatedAt: z.string().openapi({ example: '2026-03-18T00:00:00.000Z' }),
})

export type NoteResponse = z.infer<typeof noteResponseDto>
