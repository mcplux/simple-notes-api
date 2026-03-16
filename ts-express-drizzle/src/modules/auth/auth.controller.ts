import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { AuthRepository } from './auth.repository'
import { LoginInput, RegisterInput } from './dtos'
import { signToken } from '../common/utils/jwt'

export const authController = (authRepository: AuthRepository) => {
  const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
  ) => {
    // Check if user already exists
    const userExists = await authRepository.getUserByEmail(req.body.email)
    if (userExists) {
      return res.status(400).json({
        error: 'User already exists',
      })
    }

    // Hash password and create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const user = await authRepository.createUser({
      ...req.body,
      password: hashedPassword,
    })

    res.status(201).json(user)
  }

  const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    // Find user by email
    const user = await authRepository.getUserWithPassword(req.body.email)
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials (email)',
      })
    }

    // Check password
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(401).json({
        error: 'Invalid credentials (password)',
      })
    }

    // Authenticate user
    const token = signToken({ sub: user.id })

    res.json({
      token,
    })
  }

  const getUser = async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
      return res.status(500).json({
        error: 'Something went wrong getting user',
      })
    }

    res.json({
      user,
    })
  }

  return {
    register,
    login,
    getUser,
  }
}

export type AuthController = ReturnType<typeof authController>
