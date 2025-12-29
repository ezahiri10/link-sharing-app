import 'dotenv/config'
import { pool } from '../db/client.js'

async function revertToOriginal() {
  try {
    console.log('🔄 Dropping Better Auth tables...\n')
    
    await pool.query('DROP TABLE IF EXISTS verification CASCADE')
    console.log('✅ Dropped verification table')
    
    await pool.query('DROP TABLE IF EXISTS account CASCADE')
    console.log('✅ Dropped account table')
    
    await pool.query('DROP TABLE IF EXISTS session CASCADE')
    console.log('✅ Dropped session table')
    
    await pool.query('DROP TABLE IF EXISTS "user" CASCADE')
    console.log('✅ Dropped user table')
    
    console.log('\n🔄 Creating original schema...\n')
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created users table')
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL
      )
    `)
    console.log('✅ Created sessions table')
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created links table')
    
    console.log('\n✅ Database reverted to original schema!')
    
    await pool.end()
  } catch (error) {
    console.error('❌ Error:', error)
    await pool.end()
    process.exit(1)
  }
}

revertToOriginal()
