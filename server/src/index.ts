import 'dotenv/config'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './trpc/router.js'
import { createContext } from './trpc/context.js'
import { auth } from './auth/better-auth.js'

async function main() {
  try {
    // Initialize Better Auth and create tables if needed
    console.log('Initializing database...')
    
    const server = createHTTPServer({
      router: appRouter,
      createContext,
    })

    server.listen(3000)
    console.log('🚀 Server running on http://localhost:3000')
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()