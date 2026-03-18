import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { authRepository } from '../../auth/auth.repository'
import { ApiResponse } from '../types/api-response.type'

const authRepo = authRepository()

export const auth = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'Authorization header missing',
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        status: 401,
        message: 'Invalid or expired token',
      })
  }

  try {
    const { sub } = verifyToken(token)
    const user = await authRepo.getUserById(sub)
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          status: 401,
          message: 'Invalid or expired token',
        })
    }

    req.user = user

    next()
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        status: 401,
        message: 'Invalid or expired token',
      })
  }
}
