import { Router } from '@tanstack/react-router'
import { rootRoute } from './root'
import { loginRoute, registerRoute } from './auth'
import { dashboardRoute } from './dashboard'
import { linksRoute } from './links'
import { profileRoute } from './profile'
import { previewRoute } from './preview'

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  dashboardRoute.addChildren([linksRoute, profileRoute]),
  previewRoute,
])

export const router = new Router({
  routeTree,
  context: {
    user: null, // will be set from auth query
  },
})
