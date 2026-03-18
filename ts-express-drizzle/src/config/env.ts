import { z } from 'zod'

const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // Database
  DATABASE_URL: z.url(),

  // JWT
  JWT_SECRET: z.string().min(32),
})

type Env = z.infer<typeof envSchema>

class Settings {
  private readonly env: Env

  constructor() {
    const parsed = envSchema.safeParse(process.env)

    if (!parsed.success) {
      const flattenedErrors = z.flattenError(parsed.error)
      const messages = Object.entries(flattenedErrors.fieldErrors)
        .map(([field, errs]) => `  ${field}: ${errs?.join(', ')}`)
        .join('\n')

      throw new Error(`Invalid environment variables:\n${messages}`)
    }

    this.env = parsed.data
  }

  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key]
  }
}

export const env = new Settings()
export type { Env }
