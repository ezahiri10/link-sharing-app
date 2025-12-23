import { Route } from '@tanstack/react-router'
import { dashboardRoute } from './dashboard'
import ProfilePage from '../pages/ProfilePage'

export const profileRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: '/profile',
  component: ProfilePage,
})
