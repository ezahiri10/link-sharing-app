import { Route } from '@tanstack/react-router'
import { dashboardRoute } from './dashboard'
import LinksPage from '../pages/LinksPage'

export const linksRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: '/links',
  component: LinksPage,
})
