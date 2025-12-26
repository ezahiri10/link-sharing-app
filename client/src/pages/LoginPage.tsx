import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Link, useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("sessionId", data.sessionId);
      navigate({ to: "/dashboard/links" });
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/logo-devlinks-small.svg"
              alt="devlinks"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-[#333333]">devlinks</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">
              Login
            </h1>
            <p className="text-sm text-[#737373]">
              Add your details below to get back into the app
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs text-[#333333] mb-1 block">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#D9D9D9] pl-11 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-[#633CFF] focus:border-[#633CFF] bg-[#FFFFFF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#333333] mb-1 block">
                Password
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#D9D9D9] pl-11 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-[#633CFF] focus:border-[#633CFF] bg-[#FFFFFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-[#633CFF] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-[#737373] mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#633CFF] hover:underline font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
