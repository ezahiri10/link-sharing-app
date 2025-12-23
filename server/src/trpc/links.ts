import { router, protectedProcedure } from './trpc.js'

export const linksRouter = router({
  getAll: protectedProcedure.query(() => {
    return []
  }),
})
