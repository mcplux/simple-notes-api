import { Request, Response } from 'express'
import { RegisterInput } from './auth.validation'
import * as authRepo from './auth.repository'
import bcrypt from 'bcryptjs'

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) => {
  const userExists = await authRepo.getUserByEmail(req.body.email)
  if (userExists) {
    return res.status(400).json({
      error: 'User already exists',
    })
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12)
  const user = await authRepo.createUser({
    ...req.body,
    password: hashedPassword,
  })
  res.json(user)
}
