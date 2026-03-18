import app from './app'
import { env } from './config/env'

app.listen(env.get('PORT'), () => {
  console.log(`Server running on port ${env.get('PORT')}`)
})
