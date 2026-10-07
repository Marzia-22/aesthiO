import OpenAI from "openai";
import type { AIStudioRequest } from "@/types/ai";
import { aesthioPlanSchema, parseAIResponse } from "@/lib/ai/schema";

const AI_TIMEOUT_MS = 35_000;
const MAX_HISTORY_MESSAGES = 12;

export class AIStudioError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

const studioInstructions = `You are Aesthio Studio, a precise visual stylist and product-requirements planner.
Interpret natural-language requests for fashion, rooms, beauty, lifestyle, technology, or other visual aesthetics.
Return exactly 3 or 4 meaningfully distinct looks/ideas. Respect the user's budget, colors, occasion, gender preference, season, and constraints when they are supplied.
Each look must differ in silhouette, styling approach, or functional interpretation; do not restate the same look.
Items are product requirements only. Never provide retailer names, product URLs, prices for individual real products, affiliate links, or claim an item is available. searchQuery must describe what a future product-search service should find.
If refining a previous plan, preserve requested elements where possible and apply the new instruction rather than starting from unrelated ideas.
Use concise, useful editorial copy. Set unknown fields to null.`;

function messageFor(request: AIStudioRequest): string {
  const history = request.history?.slice(-MAX_HISTORY_MESSAGES) ?? [];
  const context = history.length
    ? `\nConversation context:\n${history.map((message) => `${message.role}: ${message.content}`).join("\n")}`
    : "";
  const previousPlan = request.previousPlan
    ? `\nExisting plan to refine:\n${JSON.stringify(request.previousPlan)}`
    : "";
  return `User request: ${request.prompt.trim()}${context}${previousPlan}`;
}

export async function generateAesthioPlan(request: AIStudioRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new AIStudioError("AI Studio is not configured yet. Add OPENAI_API_KEY on the server and try again.", 503);

  const client = new OpenAI({ apiKey, timeout: AI_TIMEOUT_MS, maxRetries: 1 });
  try {
    const input = request.imageUrl
      ? [{ role: "user" as const, content: [{ type: "input_text" as const, text: messageFor(request) }, { type: "input_image" as const, image_url: request.imageUrl, detail: "auto" as const }]}]
      : messageFor(request);
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: studioInstructions,
      input,
      text: { format: { type: "json_schema", name: "aesthio_plan", strict: true, schema: aesthioPlanSchema } },
    });
    if (response.status !== "completed" || !response.output_text) {
      throw new AIStudioError("The AI could not complete that plan. Please try again.", 502);
    }
    let output: unknown;
    try { output = JSON.parse(response.output_text); } catch { throw new AIStudioError("The AI returned an invalid plan. Please try again.", 502); }
    const parsed = parseAIResponse(output);
    if (!parsed) throw new AIStudioError("The AI returned an incomplete plan. Please try again.", 502);
    return parsed;
  } catch (error) {
    if (error instanceof AIStudioError) throw error;
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        const message = error.message.toLowerCase();
        if (message.includes("credit") || message.includes("billing") || message.includes("quota")) {
          throw new AIStudioError("AI Studio needs available OpenAI API credits before it can generate a plan. Add billing or credits, then try again.", 503);
        }
        throw new AIStudioError("AI Studio is busy right now. Please wait a moment and try again.", 429);
      }
      if (error.status === 401) throw new AIStudioError("AI Studio is not configured correctly. Check the server API key.", 503);
    }
    if (error instanceof Error && error.name === "APIConnectionTimeoutError") throw new AIStudioError("AI Studio took too long to respond. Please try again.", 504);
    throw new AIStudioError("AI Studio could not generate a plan right now. Please try again.", 502);
  }
}
