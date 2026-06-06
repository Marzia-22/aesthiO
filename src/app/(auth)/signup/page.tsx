import { SignupForm } from "@/components/auth/signup-form";
import { GoogleButton } from "@/components/auth/google-button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          aesthio
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Create your account
        </p>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm space-y-6">
        <GoogleButton label="Sign up with Google" />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-100" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-100" />
        </div>

        <SignupForm />
      </div>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-neutral-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}