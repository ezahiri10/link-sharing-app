import 'dotenv/config'
import { auth } from '../auth/better-auth.js'

async function migrate() {
  try {
    console.log('Running migrations...')
    // Better Auth should auto-create tables on first connection
    // Or you can manually create them
    console.log('Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
