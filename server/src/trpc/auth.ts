import { z } from 'zod'
import { router, publicProcedure } from './trpc.js'
import { auth } from '../auth/better-auth.js'

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
      return auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name || input.email.split('@')[0],
        },
        headers: ctx.req.headers,
      })
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
        headers: ctx.req.headers,
      })
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    return auth.api.signOut({
      headers: ctx.req.headers,
    })
  }),
})
