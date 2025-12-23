import { Route, Outlet, redirect } from '@tanstack/react-router'
import { rootRoute } from './root'

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})
