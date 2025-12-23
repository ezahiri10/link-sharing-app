import { z } from 'zod'
import { router, publicProcedure } from './trpc.js'
import { auth } from '../auth/better-auth'

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return auth.api.signUpEmail({
        email: input.email,
        password: input.password,
        req: ctx.req,
        res: ctx.res,
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
        email: input.email,
        password: input.password,
        req: ctx.req,
        res: ctx.res,
      })
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    return auth.api.signOut({
      req: ctx.req,
      res: ctx.res,
    })
  }),
})
