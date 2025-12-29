import { z } from 'zod'
import { router, publicProcedure } from './trpc.js'
import { auth } from '../auth/better-auth.js'
import { TRPCError } from '@trpc/server'

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
      try {
        const { email, password, name } = input

        const result = await auth.api.signUpEmail({
          body: {
            email,
            password,
            name: name || email.split('@')[0],
          },
        })

        if (!result) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Registration failed',
          })
        }

        await ctx.db.query(
          'UPDATE "user" SET first_name = $1 WHERE id = $2',
          [name || email.split('@')[0], result.user.id]
        )

        return { 
          user: {
            id: result.user.id,
            email: result.user.email,
            first_name: name || email.split('@')[0],
            image: result.user.image,
          }
        }
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already exists. Use another email.',
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Registration failed',
        })
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
          headers: ctx.req.headers,
        })

        if (!result) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          })
        }

        const userDetails = await ctx.db.query(
          'SELECT id, email, first_name, last_name, profile_email, image FROM "user" WHERE id = $1',
          [result.user.id]
        )

        const user = userDetails.rows[0]

        return {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.image,
          },
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      await auth.api.signOut({
        headers: ctx.req.headers,
      })

      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }),
})
