import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/feed";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/feed";

  console.info("OAuth callback reached", { codePresent: Boolean(code), next });

  if (!code) {
    console.warn("OAuth callback did not include an authorization code");
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.info("OAuth callback session exchange succeeded", {
        sessionCreated: Boolean(data.session),
      });
      const forwardedHost = request.headers.get("x-forwarded-host");
      const redirectOrigin = process.env.NODE_ENV !== "development" && forwardedHost
        ? `https://${forwardedHost}`
        : origin;
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    }
    console.error("Supabase OAuth callback session exchange failed", { message: error.message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown callback error";
    console.error("Supabase OAuth callback request failed", { message });
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
