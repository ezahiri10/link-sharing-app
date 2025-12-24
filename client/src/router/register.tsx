import { Route, redirect } from '@tanstack/react-router'
import { rootRoute } from './root'
import RegisterPage from '../pages/RegisterPage'

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterPage,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard/links' })
    }
  },
})
