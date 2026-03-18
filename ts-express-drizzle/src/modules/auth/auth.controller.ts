import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { AuthRepository } from './auth.repository'
import { LoginInput, RegisterInput, UserResponse } from './dtos'
import { signToken } from '../common/utils/jwt'
import { ApiResponse } from '../common/types/api-response.type'

export const authController = (authRepository: AuthRepository) => {
  const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response<ApiResponse<{ user: UserResponse }>>,
  ) => {
    // Check if user already exists
    const userExists = await authRepository.getUserByEmail(req.body.email)
    if (userExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        details: {
          email: ['Email is already in use'],
        },
      })
    }

    // Hash password and create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const user = await authRepository.createUser({
      ...req.body,
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      status: 201,
      data: { user },
    })
  }

  const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response<ApiResponse<{ token: string }>>,
  ) => {
    // Find user by email
    const user = await authRepository.getUserWithPassword(req.body.email)
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid credentials (email)',
      })
    }

    // Check password
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid credentials (password)',
      })
    }

    // Authenticate user
    const token = signToken({ sub: user.id })

    res.json({
      success: true,
      status: 200,
      data: { token },
    })
  }

  const getUser = async (
    req: Request,
    res: Response<ApiResponse<{ user: UserResponse }>>,
  ) => {
    const user = req.user
    if (!user) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: 'Something went wrong getting user',
      })
    }

    res.json({
      success: true,
      status: 200,
      data: { user },
    })
  }

  return {
    register,
    login,
    getUser,
  }
}

export type AuthController = ReturnType<typeof authController>
