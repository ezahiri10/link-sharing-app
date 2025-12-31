import { router } from '../trpc.js';
import { userRouter } from './user.js';
import { linksRouter } from './links.js';

export const appRouter = router({
  user: userRouter,
  links: linksRouter,
});

export type AppRouter = typeof appRouter;
