import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define database schema for Kysely with your actual table names
// Include views that Better Auth uses
interface Database {
  user: any;       // View mapping to users table
  session: any;    // View mapping to sessions table
  users: any;
  sessions: any;
  links: any;
  account: any;
  verification: any;
}

// Kysely instance for Better Auth
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: pool,
  }),
});

export default pool;
