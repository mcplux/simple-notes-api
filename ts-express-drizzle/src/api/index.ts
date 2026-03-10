import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import notesRoutes from '../modules/notes/notes.routes'

const api = Router()

api.use('/auth', authRoutes)
api.use('/notes', notesRoutes)

export default api
