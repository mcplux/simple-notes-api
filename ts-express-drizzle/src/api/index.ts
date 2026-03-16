import { Router } from 'express'
import { appContainer } from '../container'

const api = Router()

const { authModule, notesModule } = appContainer()

api.use(authModule.namespace, authModule.router)
api.use(notesModule.namespace, notesModule.router)

export default api
