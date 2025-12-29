import { betterAuth } from 'better-auth'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

export const auth = betterAuth({
  database: {
    db: db,
    type: 'postgres',
  },
  emailAndPassword: { 
    enabled: true,
    password: {
      hash: async (password: string) => {
        return bcrypt.hash(password, 10);
      },
      verify: async (password: string, hash: string) => {
        console.log('Password verify called:');
        console.log('  Password provided:', !!password, password?.length);
        console.log('  Hash provided:', !!hash, hash?.substring(0, 20));
        
        if (!password || !hash) {
          console.log('  ❌ Missing password or hash');
          return false;
        }
        
        const result = await bcrypt.compare(password, hash);
        console.log('  Result:', result);
        return result;
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies: false,
  },
  secret: process.env.BETTER_AUTH_SECRET || 'default-secret-change-in-production',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    process.env.CLIENT_URL || 'http://localhost:5173',
  ],
})