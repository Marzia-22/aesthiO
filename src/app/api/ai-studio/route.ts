import { NextResponse } from "next/server";
import { generateAesthioPlan, AIStudioError } from "@/lib/ai/service";
import { createClient } from "@/lib/supabase/server";
import type { AIConversationMessage, AIResponse, AIStudioRequest } from "@/types/ai";

export const runtime = "nodejs";
export const maxDuration = 45;

function isConversation(value: unknown): value is AIConversationMessage[] {
  return Array.isArray(value) && value.every((message) =>
    typeof message === "object" && message !== null &&
    ((message as Record<string, unknown>).role === "user" || (message as Record<string, unknown>).role === "assistant") &&
    typeof (message as Record<string, unknown>).content === "string"
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to use AI Studio." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Please send a valid AI Studio request." }, { status: 400 }); }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return NextResponse.json({ error: "Tell Aesthio what you want to create." }, { status: 400 });
  if (prompt.length > 1_500) return NextResponse.json({ error: "Keep your request under 1,500 characters." }, { status: 400 });
  if (body.history !== undefined && !isConversation(body.history)) return NextResponse.json({ error: "The conversation context is invalid." }, { status: 400 });
  if (body.imageUrl !== undefined && (typeof body.imageUrl !== "string" || !body.imageUrl.startsWith("https://"))) return NextResponse.json({ error: "Use a secure public image URL for image inspiration." }, { status: 400 });

  const studioRequest: AIStudioRequest = {
    prompt,
    history: body.history as AIConversationMessage[] | undefined,
    previousPlan: body.previousPlan as AIResponse | undefined,
    imageUrl: body.imageUrl as string | undefined,
  };
  try { return NextResponse.json(await generateAesthioPlan(studioRequest)); }
  catch (error) {
    const studioError = error instanceof AIStudioError ? error : new AIStudioError("AI Studio could not generate a plan right now. Please try again.", 502);
    return NextResponse.json({ error: studioError.message }, { status: studioError.status });
  }
}
