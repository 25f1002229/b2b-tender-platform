"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { login, error, clearError, isLoading, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect on successful login (not on failed login)
  useEffect(() => {
    // Only run redirect if just logged in (not if already logged in on mount)
    if (success && user && !error) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, user, error, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);
    await login(email, password);
    if (user && !error) {
    setSuccess(true);
  }
    // No redirect here; useEffect handles it based on user/error state
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@company.com"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="ml-3 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
        {success && user && !error && (
          <div className="bg-green-100 text-green-700 rounded px-3 py-2 text-sm">
            Login successful!
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
