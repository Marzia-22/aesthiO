"use client";

import { useState } from "react";
import { ArrowRight, Bookmark, Loader2, RefreshCw, Sparkles, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIResponse } from "@/types/ai";

const QUICK_REFINEMENTS = ["Make it cheaper", "Make it premium", "Make it darker", "Make it more minimal", "Make it more oversized", "Change the colors", "Change the shoes", "Remove the jacket"];
const EXAMPLES = ["black + silver oversized streetwear under ₹3000", "old money men's summer outfit", "minimalist bedroom under ₹10000"];

function formatBudget(amount: number | null, currency: string | null) {
  if (amount === null) return "Budget to explore";
  const symbol = currency === "INR" ? "₹" : currency ? `${currency} ` : "";
  return `Est. ${symbol}${Math.round(amount).toLocaleString("en-IN")}`;
}

export default function MoodboardPage() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);

  const generate = async (requestText = prompt, previousPlan?: AIResponse) => {
    const normalized = requestText.trim();
    if (!normalized) { setError("Tell Aesthio what you want to create."); return; }
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/ai-studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: normalized, previousPlan }) });
      const data: unknown = await response.json();
      if (!response.ok || typeof data !== "object" || data === null || !("understanding" in data)) {
        const message = typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" ? data.error : "AI Studio could not generate a plan. Please try again.";
        throw new Error(message);
      }
      setPlan(data as AIResponse);
      if (!previousPlan) setPrompt("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI Studio could not generate a plan. Please try again.");
    } finally { setLoading(false); }
  };

  return <div className="animate-fade-in max-w-6xl mx-auto pb-12">
    <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-6 py-9 sm:p-10 text-[#FDFBF7] mb-8">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/15 blur-3xl" />
      <div className="relative max-w-3xl"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-amber-100/70 mb-4"><Sparkles className="h-4 w-4" /> Aesthio AI Studio</div><h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">Turn a feeling into a look.</h1><p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-300">Describe an outfit, room, beauty look, or setup. Aesthio interprets the direction and gives you distinct, shoppable requirements—not invented products.</p></div>
    </section>

    <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-[0_12px_40px_rgba(38,30,20,0.04)]">
      <label htmlFor="studio-prompt" className="text-sm font-semibold text-neutral-900">What are you trying to create?</label>
      <textarea id="studio-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") generate(); }} placeholder="e.g. black + silver oversized streetwear under ₹3000" rows={3} className="mt-3 w-full resize-none rounded-2xl border border-neutral-200 bg-[#FDFBF7] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10" />
      <div className="mt-3 flex flex-wrap items-center gap-2">{EXAMPLES.map((example) => <button key={example} onClick={() => setPrompt(example)} className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">{example}</button>)}<button onClick={() => generate()} disabled={loading || !prompt.trim()} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 transition-colors">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}{loading ? "Creating your direction…" : "Generate looks"}</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </section>

    {plan && <div className="mt-8 space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-neutral-200 bg-[#F7F3EC] p-6 sm:p-7"><p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Aesthio understood</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{plan.understanding.aesthetic}</h2><div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4"><Meta label="For" value={plan.understanding.gender ?? "Any style"} /><Meta label="Moment" value={plan.understanding.occasion ?? "Open-ended"} /><Meta label="Season" value={plan.understanding.season ?? "Flexible"} /><Meta label="Budget" value={formatBudget(plan.understanding.budget, plan.understanding.currency)} /></div><div className="mt-5 flex flex-wrap gap-2">{[...plan.understanding.colors, ...plan.understanding.preferences, ...plan.understanding.constraints].map((tag, index) => <span key={`${tag}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 border border-neutral-200">{tag}</span>)}</div></section>
      <section><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Four ways in</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Your generated directions</h2></div><button onClick={() => generate("Try another variation", plan)} disabled={loading} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"><RefreshCw className="h-4 w-4" /> Try another</button></div><div className="grid gap-5 lg:grid-cols-2">{plan.looks.map((look, index) => <article key={look.id} className="rounded-3xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 transition-colors"><div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white">0{index + 1}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-neutral-900">{look.title}</h3><p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-neutral-500">{look.style}</p></div><button onClick={() => setSavedLooks((saved) => saved.includes(look.id) ? saved.filter((id) => id !== look.id) : [...saved, look.id])} className={cn("rounded-lg p-2 transition-colors", savedLooks.includes(look.id) ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900")} aria-label={`Save ${look.title}`}><Bookmark className="h-4 w-4" fill={savedLooks.includes(look.id) ? "currentColor" : "none"} /></button></div><p className="mt-3 text-sm leading-relaxed text-neutral-600">{look.description}</p><p className="mt-4 text-sm font-semibold text-neutral-900">{formatBudget(look.estimatedTotal, plan.understanding.currency)}</p></div></div><ul className="mt-5 divide-y divide-neutral-100 border-t border-neutral-100">{look.items.map((item) => <li key={`${look.id}-${item.category}-${item.searchQuery}`} className="py-3 first:pt-4"><p className="text-xs font-medium uppercase tracking-wider text-neutral-400">{item.category}</p><p className="mt-1 text-sm font-medium text-neutral-800">{item.description}</p><p className="mt-1 text-xs text-neutral-500">Search requirement: {item.searchQuery}</p></li>)}</ul><p className="mt-3 rounded-xl bg-[#FDFBF7] px-3 py-2 text-xs text-neutral-500">Retailer matching is not connected yet—these are AI-generated requirements, not product listings.</p></article>)}</div></section>
      <section className="rounded-3xl border border-neutral-200 bg-white p-6"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-neutral-500" /><h2 className="font-semibold text-neutral-900">Refine the whole direction</h2></div><p className="mt-1 text-sm text-neutral-500">These instructions go back to the AI with your current plan as context.</p><div className="mt-4 flex flex-wrap gap-2">{QUICK_REFINEMENTS.map((action) => <button key={action} disabled={loading} onClick={() => generate(action, plan)} className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 disabled:opacity-50 transition-colors">{action}<ArrowRight className="ml-1.5 inline h-3.5 w-3.5" /></button>)}</div></section>
    </div>}
  </div>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p><p className="mt-1 font-medium capitalize text-neutral-800">{value}</p></div>;
}
