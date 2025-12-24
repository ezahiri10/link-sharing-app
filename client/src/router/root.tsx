import { RootRoute, Outlet } from '@tanstack/react-router'
import { useAuthUser } from '../lib/auth'
import { router } from './index'

export const rootRoute = new RootRoute({
  component: () => {
    const { data: user, isLoading } = useAuthUser()

    // Sync user into router context
    router.update({
      context: { user },
    })

    if (isLoading) {
      return <div>Loading...</div>
    }

    return <Outlet />
  },
})
