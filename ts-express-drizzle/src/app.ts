import express from 'express'
import swaggerUi from 'swagger-ui-express'
import api from './api'
import { generateOpenAPIDocument } from './lib/openapi'

// Import OpenAPI docs to register paths
import './modules/auth/auth.openapi'
import './modules/notes/notes.openapi'

const app = express()
const openApiDocument = generateOpenAPIDocument()

app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
app.get('/openapi.json', (_, res) => res.json(openApiDocument))
app.use('/api', api)

export default app
