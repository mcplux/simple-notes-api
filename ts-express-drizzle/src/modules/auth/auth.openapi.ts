import { z } from 'zod'
import { registry } from '../../config/openapi'
import { getResponseSchema } from '../common/utils/get-response-schema'
import { loginDto, registerDto, userResponseDto } from './dtos'

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
