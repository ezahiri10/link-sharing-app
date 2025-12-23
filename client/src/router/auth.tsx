import { Route } from '@tanstack/react-router'
import { rootRoute } from './root'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})
