import type { AIResponse } from "@/types/ai";

const text = { type: "string" } as const;
const nullableText = { type: ["string", "null"] } as const;
const nullableNumber = { type: ["number", "null"] } as const;

export const aesthioPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["understanding", "looks"],
  properties: {
    understanding: {
      type: "object",
      additionalProperties: false,
      required: [
        "aesthetic", "gender", "occasion", "season", "budget", "currency",
        "colors", "preferences", "constraints",
      ],
      properties: {
        aesthetic: text,
        gender: nullableText,
        occasion: nullableText,
        season: nullableText,
        budget: nullableNumber,
        currency: nullableText,
        colors: { type: "array", items: text },
        preferences: { type: "array", items: text },
        constraints: { type: "array", items: text },
      },
    },
    looks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description", "style", "estimatedTotal", "items"],
        properties: {
          id: text,
          title: text,
          description: text,
          style: text,
          estimatedTotal: nullableNumber,
          items: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["category", "description", "searchQuery", "notes"],
              properties: {
                category: text,
                description: text,
                searchQuery: text,
                notes: nullableText,
              },
            },
          },
        },
      },
    },
  },
} as const;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

/** Validates model output again at the application boundary. */
export function parseAIResponse(value: unknown): AIResponse | null {
  if (!isRecord(value) || !isRecord(value.understanding) || !Array.isArray(value.looks)) return null;

  const understanding = value.understanding;
  if (
    typeof understanding.aesthetic !== "string" ||
    !isNullableString(understanding.gender) ||
    !isNullableString(understanding.occasion) ||
    !isNullableString(understanding.season) ||
    !isNullableNumber(understanding.budget) ||
    !isNullableString(understanding.currency) ||
    !isStringArray(understanding.colors) ||
    !isStringArray(understanding.preferences) ||
    !isStringArray(understanding.constraints)
  ) return null;

  const looks = value.looks.map((look) => {
    if (!isRecord(look) || !Array.isArray(look.items)) return null;
    if (
      typeof look.id !== "string" || typeof look.title !== "string" ||
      typeof look.description !== "string" || typeof look.style !== "string" ||
      !isNullableNumber(look.estimatedTotal)
    ) return null;
    const items = look.items.map((item) => {
      if (!isRecord(item) || typeof item.category !== "string" ||
        typeof item.description !== "string" || typeof item.searchQuery !== "string" ||
        !isNullableString(item.notes)) return null;
      return { category: item.category, description: item.description, searchQuery: item.searchQuery, notes: item.notes };
    });
    if (items.some((item) => item === null)) return null;
    return { id: look.id, title: look.title, description: look.description, style: look.style, estimatedTotal: look.estimatedTotal, items };
  });

  if (looks.some((look) => look === null) || looks.length < 3 || looks.length > 4) return null;
  return {
    understanding: {
      aesthetic: understanding.aesthetic,
      gender: understanding.gender,
      occasion: understanding.occasion,
      season: understanding.season,
      budget: understanding.budget,
      currency: understanding.currency,
      colors: understanding.colors,
      preferences: understanding.preferences,
      constraints: understanding.constraints,
    },
    looks: looks as AIResponse["looks"],
  };
}
