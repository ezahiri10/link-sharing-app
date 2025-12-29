import { Router } from '@tanstack/react-router'
import { rootRoute } from './root'
import { loginRoute } from './login'
import { registerRoute } from './register'
import { dashboardRoute } from './dashboard'
import { linksRoute } from './links'
import { profileRoute } from './profile'
import { previewRoute } from './preview'
import { createRoute, redirect } from '@tanstack/react-router'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const sessionId = localStorage.getItem('sessionId')

    if (sessionId) {
      throw redirect({ to: '/dashboard/links' })
    } else {
      throw redirect({ to: '/login' })
    }
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
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
