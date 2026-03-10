import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { usersTable } from './auth.schemas'
import { RegisterInput } from './auth.validation'

export const createUser = async (data: RegisterInput) => {
  const [user] = await db.insert(usersTable).values(data).returning()
  console.log(user)

  return user
}

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  return user ?? null
}
