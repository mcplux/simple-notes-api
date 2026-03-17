import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
extendZodWithOpenApi(z)

export const loginDto = z
  .object({
    email: z
      .email('Invalid email address')
      .openapi({ example: 'user@example.com' }),
    password: z.string().openapi({ example: 'SecurePassword123' }),
  })
  .openapi('Login DTO')

export type LoginInput = z.infer<typeof loginDto>
