import 'dotenv/config'
import { pool } from '../db/client.js'

async function migrate() {
  try {
    console.log('🔄 Dropping existing tables...\n')
    
    // Drop tables in correct order (respecting foreign keys)
    await pool.query('DROP TABLE IF EXISTS links CASCADE;')
    await pool.query('DROP TABLE IF EXISTS verification CASCADE;')
    await pool.query('DROP TABLE IF EXISTS account CASCADE;')
    await pool.query('DROP TABLE IF EXISTS session CASCADE;')
    await pool.query('DROP TABLE IF EXISTS "user" CASCADE;')
    console.log('✅ Old tables dropped\n')

    console.log('🔄 Creating database tables...\n')

    // Create user table for Better Auth
    await pool.query(`
      CREATE TABLE "user" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        name TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        image TEXT
      );
    `)
    console.log('✅ User table created')

    // Create session table
    await pool.query(`
      CREATE TABLE session (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "expiresAt" TIMESTAMP NOT NULL,
        token TEXT UNIQUE NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ Session table created')

    // Create account table with password column
    await pool.query(`
      CREATE TABLE account (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accountId" TEXT NOT NULL,
        provider TEXT NOT NULL,
        password TEXT,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "expiresAt" TIMESTAMP,
        scope TEXT,
        "accessTokenExpiresAt" TIMESTAMP,
        "refreshTokenExpiresAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ Account table created')

    // Create verification table
    await pool.query(`
      CREATE TABLE verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ Verification table created')

    // Create links table for your app
    await pool.query(`
      CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        title TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
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
