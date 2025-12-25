import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useNavigate, Link } from "@tanstack/react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = trpc.auth.login.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate empty fields
    let hasError = false;
    if (!email.trim()) {
      setEmailError("Can't be empty");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Can't be empty");
      hasError = true;
    }

    if (hasError) return;

    try {
      await login.mutateAsync({ email, password });
      navigate({ to: "/dashboard/links" });
    } catch (err: any) {
      // Show "Please check again" on both fields for authentication errors
      setEmailError("Please check again");
      setPasswordError("Please check again");
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8">
      
      <div className="mb-8 text-center">
        <img 
          src="/assets/images/logo-s-large.svg" 
          alt="devlinks"
          className="h-10 mx-auto"
        />
      </div>

      <div className="w-full max-w-md border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add your details below to get back into the app
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
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`
                  w-full
                  rounded-lg
                  border
                  ${emailError ? 'border-[#FF3939] focus:ring-[#FF3939]' : 'border-gray-300 focus:ring-purple-500'}
                  bg-white
                  pl-10 ${emailError ? 'pr-28' : 'pr-3'} py-2
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
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
              Password
            </label>
            <div className="relative">
              <img 
                src="/assets/images/icon-password.svg" 
                alt=""
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={`
                  w-full
                  rounded-lg
                  border
                  ${passwordError ? 'border-[#FF3939] focus:ring-[#FF3939]' : 'border-gray-300 focus:ring-purple-500'}
                  bg-white
                  pl-10 ${passwordError ? 'pr-32' : 'pr-3'} py-2
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
                `}
              />
              {passwordError && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#FF3939]">
                  {passwordError}
                </span>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={login.isPending}
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              text-white
              text-sm
              font-medium
              py-2.5
              rounded-lg
              transition
              disabled:opacity-50
            "
          >
            {login.isPending ? "Logging in…" : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
