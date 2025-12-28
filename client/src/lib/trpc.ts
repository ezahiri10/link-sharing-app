import { createTRPCReact } from '@trpc/react-query';

// @ts-ignore
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();
