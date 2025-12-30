import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';
import { auth } from '../auth/better-auth.js';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name || '',
          },
        });

        if (!result?.user) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create user',
          });
        }

        return {
          user: result.user,
        };
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Email already registered',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Registration failed',
        });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
        });

        if (!result?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        return {
          user: result.user,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      await auth.api.signOut({
        headers: ctx.req.headers as any,
      });
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  }),
});
