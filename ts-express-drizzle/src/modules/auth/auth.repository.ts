import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { usersTable } from './auth.schemas'
import { RegisterInput } from './auth.validation'

export const createUser = async (data: RegisterInput) => {
  const [user] = await db.insert(usersTable).values(data).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  })

  return user
}

export const getUserByEmail = async (email: string) => {
  const response = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

  return response.length > 0 ? response[0] : null
}

export const getUserWithPassword = async (email: string) => {
  const response = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

  return response.length > 0 ? response[0] : null
}

export const getUserById = async (id: string) => {
  const response = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id))

  return response.length > 0 ? response[0] : null
}
