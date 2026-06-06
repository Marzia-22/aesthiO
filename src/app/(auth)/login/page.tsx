import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          aesthio
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Sign in to your account
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm space-y-6">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-100" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-100" />
        </div>

        <LoginForm />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-neutral-900 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}