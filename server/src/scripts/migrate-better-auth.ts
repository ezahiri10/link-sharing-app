import 'dotenv/config'
import { pool } from '../db/client.js'

async function migrateToBetterAuth() {
  try {
    console.log('🔄 Creating Better Auth tables...\n')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        emailVerified BOOLEAN NOT NULL DEFAULT false,
        name TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
        image TEXT
      );
    `)
    console.log('✅ user table created')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        expiresAt TIMESTAMP NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ session table created')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        expiresAt TIMESTAMP,
        password TEXT,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ account table created')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    console.log('✅ verification table created')

    console.log('\n🔄 Migrating existing users...\n')

    const existingUsers = await pool.query(`
      SELECT id, email, first_name, last_name, image, created_at, password_hash
      FROM users
      WHERE id NOT IN (SELECT id FROM "user")
    `)

    for (const oldUser of existingUsers.rows) {
      const name = [oldUser.first_name, oldUser.last_name].filter(Boolean).join(' ') || oldUser.email.split('@')[0]
      
      await pool.query(`
        INSERT INTO "user" (id, email, name, image, emailVerified, createdAt, updatedAt)
        VALUES ($1, $2, $3, $4, true, $5, $5)
        ON CONFLICT (id) DO NOTHING
      `, [oldUser.id, oldUser.email, name, oldUser.image, oldUser.created_at])

      await pool.query(`
        INSERT INTO "account" (id, accountId, providerId, userId, password, createdAt, updatedAt)
        VALUES ($1, $2, 'credential', $3, $4, $5, $5)
        ON CONFLICT (id) DO NOTHING
      `, [
        `${oldUser.id}-credential`,
        oldUser.email,
        oldUser.id,
        oldUser.password_hash,
        oldUser.created_at
      ])

      console.log(`✅ Migrated user: ${oldUser.email}`)
    }

    console.log('\n🔄 Adding profile fields to user table...\n')

    await pool.query(`
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS first_name TEXT;
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS last_name TEXT;
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS profile_email TEXT;
    `)
    console.log('✅ Profile fields added')

    await pool.query(`
      UPDATE "user" u
      SET 
        first_name = old_u.first_name,
        last_name = old_u.last_name,
        profile_email = old_u.profile_email
      FROM users old_u
      WHERE u.id = old_u.id
    `)
    console.log('✅ Profile data migrated')

    console.log('\n🎉 Better Auth migration completed successfully!')
    console.log('\n⚠️  Note: Old "users" and "sessions" tables are still present.')
    console.log('Once you verify everything works, you can drop them manually.\n')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await pool.end()
    process.exit(1)
  }
}

migrateToBetterAuth()
