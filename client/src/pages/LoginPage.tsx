import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { useNavigate } from '@tanstack/react-router'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = trpc.auth.login.useMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await login.mutateAsync({ email, password })
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        navigate({ to: '/dashboard/links' })
      }, 1000)
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err?.shape?.message || err?.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
