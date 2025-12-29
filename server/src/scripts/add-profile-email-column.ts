import 'dotenv/config'
import { pool } from '../db/client.js'

async function addProfileEmail() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_email TEXT')
    console.log('✅ Added profile_email column to users table')
    await pool.end()
  } catch (error) {
    console.error('❌ Error:', error)
    await pool.end()
    process.exit(1)
  }
}

addProfileEmail()
