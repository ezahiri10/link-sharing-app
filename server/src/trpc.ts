import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { pool } from './db/client.js';
import { auth } from './auth/better-auth.js';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  let user = null;

  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (session?.user) {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, profile_email, image FROM users WHERE id = $1',
        [session.user.id]
      );
      
      user = result.rows[0] || null;
    }
  } catch (error) {
    user = null;
  }

  return {
    req,
    res,
    db: pool,
    user,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
