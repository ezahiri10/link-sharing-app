import { initTRPC, TRPCError } from '@trpc/server';
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            user: ctx.user,
            db: ctx.db,
            req: ctx.req,
            res: ctx.res,
        },
    });
});
//# sourceMappingURL=trpc.js.map