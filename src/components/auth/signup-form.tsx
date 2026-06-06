"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-4 space-y-2">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-neutral-900">Check your email</p>
        <p className="text-sm text-neutral-500">
          We sent a confirmation link to <span className="font-medium">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
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
        <label className="text-sm font-medium text-neutral-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          minLength={8}
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
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-xs text-neutral-400 text-center">
        By signing up you agree to our{" "}
        <a href="#" className="underline hover:text-neutral-600">Terms</a>
        {" "}and{" "}
        <a href="#" className="underline hover:text-neutral-600">Privacy Policy</a>
      </p>
    </form>
  );
}