import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { auth } from '../auth/better-auth.js'
import { pool } from '../db/client.js'

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    return {
      req,
      res,
      db: pool,
      user: session?.user ?? null,
    }
  } catch (error) {
    console.error('Context creation error:', error)
    return {
      req,
      res,
      db: pool,
      user: null,
    }
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
