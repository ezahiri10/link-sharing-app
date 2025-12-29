import { createTRPCReact } from '@trpc/react-query';

// For local development with server in same workspace
type AppRouter = typeof import('../../../server/src/routers/index').appRouter;

// For production deployment (separate repos), use type assertion
export const trpc = createTRPCReact<AppRouter>() as any;
