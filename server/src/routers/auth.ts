import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const existingUser = await ctx.db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already registered',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = randomBytes(16).toString('hex');
      const sessionId = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await ctx.db.query(
        'INSERT INTO users (id, email, password_hash, first_name) VALUES ($1, $2, $3, $4)',
        [userId, email, passwordHash, email.split('@')[0]]
      );

      await ctx.db.query(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
        [sessionId, userId, expiresAt]
      );

      const user = await ctx.db.query(
        'SELECT id, email, first_name, last_name, image FROM users WHERE id = $1',
        [userId]
      );

      return {
        sessionId,
        user: user.rows[0],
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const result = await ctx.db.query(
        'SELECT id, email, password_hash, first_name, last_name, image FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      const sessionId = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await ctx.db.query(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
        [sessionId, user.id, expiresAt]
      );

      return {
        sessionId,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          image: user.image,
        },
      };
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const sessionId = ctx.req.headers.authorization?.replace('Bearer ', '');

    if (sessionId) {
      await ctx.db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    }

    return { success: true };
  }),
});
