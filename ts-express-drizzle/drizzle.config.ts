import { Config } from 'drizzle-kit'

export default {
  schema: './src/modules/**/*.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://devroot:devpassword@localhost:5432/devdb',
  },
} satisfies Config
