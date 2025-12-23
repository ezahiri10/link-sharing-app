import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { auth } from '../auth/better-auth'
import { pool } from '../db/client'

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  const session = await auth.api.getSession({ req, res })

  return {
    req,
    res,
    db: pool,
    user: session?.user ?? null,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
