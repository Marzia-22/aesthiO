"use client";

import { useState } from "react";
import { Mic, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadModal } from "@/store/upload-modal";
import { useRouter } from "next/navigation";

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  onerror: () => void;
};

export function Topbar() {
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const openUpload = useUploadModal((s) => s.open);
  const router = useRouter();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    if (query) router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceMessage("Voice search is not available in this browser."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false; recognition.interimResults = false; recognition.lang = navigator.language || "en-US";
    recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript.trim(); if (transcript) { setSearch(transcript); router.push(`/explore?q=${encodeURIComponent(transcript)}`); } };
    recognition.onerror = () => setVoiceMessage("Voice search could not hear that. Try again or type your search.");
    recognition.onend = () => setListening(false);
    setVoiceMessage(null); setListening(true); recognition.start();
  };

  return (
    <header className="fixed top-0 left-0 md:left-56 right-0 h-16 bg-[#FDFBF7]/95 backdrop-blur border-b border-neutral-100 flex items-center px-4 md:px-6 gap-3 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <form onSubmit={submitSearch} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search aesthetics, styles, creators…"
            className={cn(
              "w-full pl-10 pr-20 py-2.5 rounded-2xl text-sm",
              "border border-neutral-200 bg-white/90",
              "placeholder:text-neutral-400 text-[#111111]",
              "focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400",
              "transition-all duration-200"
            )}
          />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900"><X className="w-3.5 h-3.5" /></button>}
          <button type="button" onClick={startVoiceSearch} aria-label="Search by voice" className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors", listening ? "bg-neutral-900 text-white animate-pulse" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900")}><Mic className="w-4 h-4" /></button>
          {voiceMessage && <p role="status" className="absolute top-full mt-2 left-0 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg">{voiceMessage}</p>}
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={openUpload}
          className="text-sm font-medium px-3 md:px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all"
        >
          <span className="hidden sm:inline">+ Post</span><span className="sm:hidden">+</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600 cursor-pointer hover:bg-neutral-300 transition-colors">
          U
        </div>
      </div>
    </header>
  );
}
