import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { UserInsert, usersTable } from './schemas/users.schema'

export const authRepository = () => {
  const createUser = async (data: UserInsert) => {
    const [user] = await db.insert(usersTable).values(data).returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })

    return user
  }

  const getUserByEmail = async (email: string) => {
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

  const getUserWithPassword = async (email: string) => {
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

  const getUserById = async (id: string) => {
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

  return {
    createUser,
    getUserById,
    getUserByEmail,
    getUserWithPassword,
  }
}

export type AuthRepository = ReturnType<typeof authRepository>
