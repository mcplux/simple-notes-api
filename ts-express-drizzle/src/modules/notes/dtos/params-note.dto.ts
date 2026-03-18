import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const paramsNoteDto = z.object({
  id: z.uuid('Invalid UUID').openapi({
    description: 'Note ID',
  }),
})

export type ParamsNote = z.infer<typeof paramsNoteDto>
