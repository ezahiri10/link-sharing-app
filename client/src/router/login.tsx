import { Route, redirect } from '@tanstack/react-router'
import { rootRoute } from './root'
import LoginPage from '../pages/LoginPage'

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard/links' })
    }
  },
})
