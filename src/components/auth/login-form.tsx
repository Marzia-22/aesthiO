"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace("/feed");
      router.refresh();
    } catch {
      setError("Aesthio could not reach its authentication service. Check your connection and Supabase project configuration, then try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm",
            "border border-neutral-200 bg-white",
            "placeholder:text-neutral-400 text-neutral-900",
            "focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400",
            "transition-all duration-200"
          )}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700">Password</label>
          <a href="#" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm",
            "border border-neutral-200 bg-white",
            "placeholder:text-neutral-400 text-neutral-900",
            "focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400",
            "transition-all duration-200"
          )}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-medium",
          "bg-neutral-900 text-white",
          "hover:bg-neutral-800 active:scale-[0.98]",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
