import 'dotenv/config'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './trpc/router.js'
import { createContext } from './trpc/context.js'

async function main() {
  try {
    console.log('Initializing database...')
    
    const server = createHTTPServer({
      router: appRouter,
      createContext,
      middleware(req, res, next) {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        // Handle preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        next()
      },
    })

    server.listen(3000)
    console.log('🚀 Server running on http://localhost:3000')
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()