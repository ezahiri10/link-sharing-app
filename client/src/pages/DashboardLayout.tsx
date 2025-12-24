import { Outlet, Link } from '@tanstack/react-router'
import { trpc } from '../lib/trpc'
import { useNavigate } from '@tanstack/react-router'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate({ to: '/login' })
    },
  })

  return (
    <div>
      <nav>
        <Link to="/dashboard/links">Links</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <button onClick={() => logout.mutate()}>Logout</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
