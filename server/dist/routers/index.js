import { router } from '../trpc.js';
import { authRouter } from './auth.js';
import { userRouter } from './user.js';
import { linksRouter } from './links.js';
export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    links: linksRouter,
});
//# sourceMappingURL=index.js.map