import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Database {
  user: any;
  session: any;
  users: any;
  sessions: any;
  links: any;
  account: any;
  verification: any;
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: pool,
  }),
});

export default pool;
