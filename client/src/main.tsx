import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { router } from './router'
import { trpc } from './lib/trpc'
import { httpBatchLink } from '@trpc/client'
import { useEffect } from 'react'
import './index.css'

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})

function App() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: false,
    staleTime: Infinity, // Cache forever until manually invalidated
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    router.update({
      context: { user: user || undefined },
    })
  }, [user])

  return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
)
