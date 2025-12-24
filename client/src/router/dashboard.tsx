import { Route, redirect, Outlet, Link } from '@tanstack/react-router'
import { rootRoute } from './root'
import { trpc } from '../lib/trpc'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

function DashboardLayout() {
  const navigate = useNavigate()
  const { data: user } = trpc.user.me.useQuery()
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate({ to: '/login' })
    },
  })

  const [copied, setCopied] = useState(false)

  function handleCopyShareLink() {
    if (!user?.id) return
    
    const url = `${window.location.origin}/preview/${user.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/dashboard/links" style={{ marginRight: '20px' }}>Links</Link>
        <Link to="/dashboard/profile" style={{ marginRight: '20px' }}>Profile</Link>
        
        {user && (
          <button 
            onClick={handleCopyShareLink}
            style={{
              padding: '8px 16px',
              backgroundColor: copied ? '#4caf50' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Share Link'}
          </button>
        )}
        
        <button 
          onClick={() => logout.mutate()}
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </button>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout,
})
