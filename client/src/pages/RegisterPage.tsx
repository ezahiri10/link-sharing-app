import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { useNavigate, Link } from '@tanstack/react-router'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = trpc.auth.register.useMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Reset errors
    setEmailError('')
    setPasswordError('')
    setConfirmError('')

    // Validate empty fields
    let hasError = false
    if (!email.trim()) {
      setEmailError("Can't be empty")
      hasError = true
    }
    if (!password.trim()) {
      setPasswordError("Can't be empty")
      hasError = true
    }
    if (!confirmPassword.trim()) {
      setConfirmError("Can't be empty")
      hasError = true
    }

    if (hasError) return

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      setConfirmError('Passwords do not match')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setPasswordError('At least 6 characters')
      return
    }

    try {
      await register.mutateAsync({ email, password, name: email.split('@')[0] })
      navigate({ to: '/dashboard/links' })
    } catch (err: any) {
      const errorMessage = err?.shape?.message || err?.message || 'Registration failed'
      if (errorMessage.includes('already exists')) {
        setEmailError('Email already exists')
      } else {
        setEmailError('Please check again')
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8">
      
      <div className="mb-8 text-center">
        <img 
          src="/assets/images/logo-devlinks-large.svg" 
          alt="devlinks"
          className="h-10 mx-auto"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Let's get you started sharing your links!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative">
              <img 
                src="/assets/images/icon-email.svg" 
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />
              <input
                type="email"
                placeholder="e.g. alex@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                className={`
                  w-full rounded-lg border
                  ${emailError ? 'border-[#FF3939] focus:ring-[#FF3939]' : 'border-gray-300 focus:ring-purple-500'}
                  bg-white pl-10 ${emailError ? 'pr-32' : 'pr-3'} py-2 text-sm
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2
                `}
              />
              {emailError && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                  {emailError}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Create password
            </label>
            <div className="relative">
              <img 
                src="/assets/images/icon-password.svg" 
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                className={`
                  w-full rounded-lg border
                  ${passwordError ? 'border-[#FF3939] focus:ring-[#FF3939]' : 'border-gray-300 focus:ring-purple-500'}
                  bg-white pl-10 ${passwordError ? 'pr-36' : 'pr-3'} py-2 text-sm
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2
                `}
              />
              {passwordError && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                  {passwordError}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="relative">
              <img 
                src="/assets/images/icon-password.svg" 
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setConfirmError('')
                }}
                className={`
                  w-full rounded-lg border
                  ${confirmError ? 'border-[#FF3939] focus:ring-[#FF3939]' : 'border-gray-300 focus:ring-purple-500'}
                  bg-white pl-10 ${confirmError ? 'pr-36' : 'pr-3'} py-2 text-sm
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2
                `}
              />
              {confirmError && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                  {confirmError}
                </span>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg
                       transition disabled:opacity-50"
          >
            {register.isPending ? 'Creating account…' : 'Create new account'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
