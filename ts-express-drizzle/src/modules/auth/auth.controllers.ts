import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { LoginInput, RegisterInput } from './auth.validation'
import * as authRepo from './auth.repository'
import { signToken } from '../common/utils/jwt'

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) => {
  // Check if user already exists
  const userExists = await authRepo.getUserByEmail(req.body.email)
  if (userExists) {
    return res.status(400).json({
      error: 'User already exists',
    })
  }

  // Hash password and create a new user
  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  const user = await authRepo.createUser({
    ...req.body,
    password: hashedPassword,
  })

  res.json(user)
}

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  // Find user by email
  const user = await authRepo.getUserByEmail(req.body.email)
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
