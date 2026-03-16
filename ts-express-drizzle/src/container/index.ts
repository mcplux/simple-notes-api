import { authModule } from '../modules/auth/auth.module'
import { notesModule } from '../modules/notes/notes.module'

export const appContainer = () => {
  return {
    authModule: authModule(),
    notesModule: notesModule(),
  }
}
