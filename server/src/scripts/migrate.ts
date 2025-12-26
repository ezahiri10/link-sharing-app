import 'dotenv/config'
import { pool } from '../db/client.js'

async function migrate() {
  try {
    console.log('🔄 Dropping existing tables...\n')
    
    // Drop tables in correct order (respecting foreign keys)
    await pool.query('DROP TABLE IF EXISTS links CASCADE;')
    await pool.query('DROP TABLE IF EXISTS sessions CASCADE;')
    await pool.query('DROP TABLE IF EXISTS users CASCADE;')
    console.log('✅ Old tables dropped\n')

    console.log('🔄 Creating database tables...\n')

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_email TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created')

    // Create sessions table
    await pool.query(`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL
      );
    `)
    console.log('✅ Sessions table created')

    // Create links table
    await pool.query(`
      CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('✅ Links table created')

    console.log('\n🎉 All tables created successfully!')
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await pool.end()
    process.exit(1)
  }
}

migrate()
