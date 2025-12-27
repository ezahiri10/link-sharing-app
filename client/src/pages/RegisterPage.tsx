import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { useNavigate, Link } from '@tanstack/react-router'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const register = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("sessionId", data.sessionId);
      navigate({ to: "/dashboard/links" });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      
      // Check for validation errors
      if (error.message?.includes("Invalid email") || error.data?.zodError) {
        setEmailError("Invalid email");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Can't be empty");
      hasError = true;
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email");
        hasError = true;
      }
    }

    if (!password) {
      setPasswordError("Can't be empty");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("At least 8 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Can't be empty");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      hasError = true;
    }

    if (hasError) return;

    register.mutate({ email, password });
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">Create account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Let's get you started sharing your links!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`text-xs mb-1 block ${emailError ? "text-[#FF3939]" : "text-[#333333]"}`}>
                Email address
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="e.g. alex@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setEmailError("");
                  }}
                  className={`w-full rounded-lg border ${
                    emailError ? "border-[#FF3939] focus:ring-[#FF3939] focus:border-[#FF3939]" : "border-[#D9D9D9] focus:ring-[#633CFF] focus:border-[#633CFF]"
                  } pl-11 pr-32 py-3 text-sm text-[#333333] placeholder:text-[#737373] focus:outline-none focus:ring-1 bg-[#FFFFFF]`}
                />
                {emailError && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                    {emailError}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className={`text-xs mb-1 block ${passwordError ? "text-[#FF3939]" : "text-[#333333]"}`}>
                Create password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setPasswordError("");
                  }}
                  className={`w-full rounded-lg border ${
                    passwordError ? "border-[#FF3939] focus:ring-[#FF3939] focus:border-[#FF3939]" : "border-[#D9D9D9] focus:ring-[#633CFF] focus:border-[#633CFF]"
                  } pl-11 pr-32 py-3 text-sm text-[#333333] placeholder:text-[#737373] focus:outline-none focus:ring-1 bg-[#FFFFFF]`}
                />
                {passwordError && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                    {passwordError}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className={`text-xs mb-1 block ${confirmPasswordError ? "text-[#FF3939]" : "text-[#333333]"}`}>
                Confirm password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                    setConfirmPasswordError("");
                  }}
                  className={`w-full rounded-lg border ${
                    confirmPasswordError ? "border-[#FF3939] focus:ring-[#FF3939] focus:border-[#FF3939]" : "border-[#D9D9D9] focus:ring-[#633CFF] focus:border-[#633CFF]"
                  } pl-11 pr-32 py-3 text-sm text-[#333333] placeholder:text-[#737373] focus:outline-none focus:ring-1 bg-[#FFFFFF]`}
                />
                {confirmPasswordError && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                    {confirmPasswordError}
                  </span>
                )}
              </div>
            </div>

            {error && email && password && confirmPassword && (
              <p className="text-xs text-[#FF3939]">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-[#633CFF] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
