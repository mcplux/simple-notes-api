import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle('postgres://devroot:devpassword@localhost:5432/devdb')
