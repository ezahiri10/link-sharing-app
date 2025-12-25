import { Route, redirect, Outlet } from '@tanstack/react-router'
import { rootRoute } from './root'
import { queryClient } from '../lib/queryClient'

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <Outlet />,
  beforeLoad: async () => {
    try {
      // Check if user is authenticated
      const response = await fetch('http://localhost:3000/user.me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw redirect({
          to: '/login',
        })
      }

      const data = await response.json()
      
      if (!data.result?.data) {
        throw redirect({
          to: '/login',
        })
      }

      const user = data.result.data

      // Store in query cache for use in components
      queryClient.setQueryData([['user', 'me']], user)

      return { user }
    } catch (error) {
      throw redirect({
        to: '/login',
      })
    }
  },
})
