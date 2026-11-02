"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";

const ADMIN_USERNAME = "teamwebbed@admin";
const ADMIN_PASSWORD = "webbedadmin_123";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid username or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#08080f] px-4">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-900/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-violet-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="WEBBED"
            className="h-10 w-auto"
          />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-white/40">
              Sign in to manage your content
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="teamwebbed@admin"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-12 text-sm text-white placeholder-white/25 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-60 shadow-[0_0_25px_rgba(79,70,229,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/25">
          WEBBED Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  );
}
