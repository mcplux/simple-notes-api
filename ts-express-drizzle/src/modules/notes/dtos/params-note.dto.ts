import { z } from 'zod'

export const paramsNoteDto = z.object({
  id: z.uuid('Invalid UUID'),
})

export type ParamsNote = z.infer<typeof paramsNoteDto>
