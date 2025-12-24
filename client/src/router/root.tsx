import { RootRoute, Outlet } from '@tanstack/react-router'

export const rootRoute = new RootRoute({
  component: () => <Outlet />,
})
