import z from 'zod'
import { registry } from '../../lib/openapi'
import { getResponseSchema } from '../common/utils/get-response-schema'
import { createNoteSchema, noteResponseDto, paramsNoteDto } from './dtos'

registry.registerPath({
  method: 'post',
  path: '/api/notes',
  tags: ['Notes'],
  summary: 'Create a new note',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: createNoteSchema } },
    },
  },
  responses: {
    201: {
      description: 'Note created successfully',
      content: {
        'application/json': {
          schema: getResponseSchema(201, z.object({ note: noteResponseDto })),
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/notes',
  tags: ['Notes'],
  summary: 'Get all notes',
  security: [{ bearerAuth: [] }],
  responses: {
    201: {
      description: 'Notes retrieved successfully',
      content: {
        'application/json': {
          schema: getResponseSchema(
            201,
            z.object({ notes: z.array(noteResponseDto) }),
          ),
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/notes/{id}',
  tags: ['Notes'],
  summary: 'Get note by id',
  security: [{ bearerAuth: [] }],
  request: {
    params: paramsNoteDto,
  },
  responses: {
    201: {
      description: 'Note retrieved successfully',
      content: {
        'application/json': {
          schema: getResponseSchema(201, z.object({ note: noteResponseDto })),
        },
      },
    },
  },
})
