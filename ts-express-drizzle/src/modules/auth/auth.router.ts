import { Router } from 'express'
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { validateSchema } from '../common/middlewares/validate-schema.middleware'
import { auth } from '../common/middlewares/auth.middleware'
import { AuthController } from './auth.controller'
import { loginDto, registerDto, userResponseDto } from './dtos'
import { registry } from '../../lib/openapi'
import { getResponseSchema } from '../common/utils/get-response-schema'

extendZodWithOpenApi(z)

export const authRouter = (authController: AuthController) => {
  const router = Router()
  const namespace = '/auth'

  router.post('/register', validateSchema(registerDto), authController.register)
  router.post('/login', validateSchema(loginDto), authController.login)
  router.get('/me', auth, authController.getUser)

  return {
    router,
    namespace,
  }
}

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Create user',
  request: {
    body: {
      content: { 'application/json': { schema: registerDto } },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: getResponseSchema(201, z.object({ user: userResponseDto })),
        },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Login',
  request: {
    body: {
      content: { 'application/json': { schema: loginDto } },
    },
  },
  responses: {
    200: {
      description: 'User authenticated successfully',
      content: {
        'application/json': {
          schema: getResponseSchema(
            200,
            z.object({
              token: z.string().openapi({ example: 'jwt.token.here' }),
            }),
          ),
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Auth'],
  summary: 'Get user info',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Authenticated user info',
      content: {
        'application/json': {
          schema: getResponseSchema(200, z.object({ user: userResponseDto })),
        },
      },
    },
  },
})
