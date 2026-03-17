import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const userResponseDto = z.object({
  id: z.uuid(),
  email: z.email().openapi({ example: 'user@example.com' }),
  name: z.string().openapi({ example: 'User name' }),
})

export type UserResponse = z.infer<typeof userResponseDto>
