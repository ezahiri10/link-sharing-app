import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { useNavigate } from '@tanstack/react-router'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = trpc.auth.register.useMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      const result = await register.mutateAsync({ email, password, name: email.split('@')[0] })
      console.log('Registration successful:', result)
      setSuccess('Registration successful! Redirecting...')
      setTimeout(() => {
        navigate({ to: '/dashboard/links' })
      }, 1000)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err?.shape?.message || err?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

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

      <input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={register.isPending}>
        {register.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
