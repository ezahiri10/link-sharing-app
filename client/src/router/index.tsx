import { Router } from '@tanstack/react-router'
import { rootRoute } from './root'
import { loginRoute } from './login'
import { registerRoute } from './register'
import { dashboardRoute } from './dashboard'
import { linksRoute } from './links'
import { profileRoute } from './profile'
import { previewRoute } from './preview'

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  previewRoute,
  dashboardRoute.addChildren([linksRoute, profileRoute]),
])

export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  context: {
    user: undefined,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
