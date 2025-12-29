import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { pool } from '../db/client.js'
import { auth } from '../auth/better-auth.js'

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  const session = await auth.api.getSession({ headers: req.headers })

  return {
    req,
    res,
    db: pool,
    user: session?.user || null,
    session: session?.session || null,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
