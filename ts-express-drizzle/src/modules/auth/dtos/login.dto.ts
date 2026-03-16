import { z } from 'zod'

export const loginDto = z.object({
  email: z.email('Invalid email address'),
  password: z.string(),
})
export type LoginInput = z.infer<typeof loginDto>
