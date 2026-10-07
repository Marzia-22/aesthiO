export interface AIUnderstanding {
  aesthetic: string;
  gender: string | null;
  occasion: string | null;
  season: string | null;
  budget: number | null;
  currency: string | null;
  colors: string[];
  preferences: string[];
  constraints: string[];
}

export interface ProductRequirement {
  category: string;
  description: string;
  searchQuery: string;
}

export interface AIItem extends ProductRequirement {
  notes: string | null;
}

export interface AILook {
  id: string;
  title: string;
  description: string;
  style: string;
  estimatedTotal: number | null;
  items: AIItem[];
}

export interface AIResponse {
  understanding: AIUnderstanding;
  looks: AILook[];
}

export interface AIConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIStudioRequest {
  prompt: string;
  history?: AIConversationMessage[];
  previousPlan?: AIResponse;
  /** Public image URL for a future/optional vision-enabled Studio input. */
  imageUrl?: string;
}
