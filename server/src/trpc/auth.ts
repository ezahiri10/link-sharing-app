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
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name || input.email.split('@')[0],
          },
          headers: ctx.req.headers,
        })
        console.log('Registration result:', result)
        return result
      } catch (error) {
        console.error('Registration error:', error)
        throw error
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
        console.log('Login result:', result)
        return result
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    return auth.api.signOut({
      headers: ctx.req.headers,
    })
  }),
})
