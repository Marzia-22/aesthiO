"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Bookmark, Search, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const VISUALS = [
  "https://images.unsplash.com/photo-1674833482676-2094bc3d8499?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
];

const exampleLooks = [
  ["01", "Chrome street", "black bomber · wide cargo · silver chain"],
  ["02", "Off-hours minimal", "washed tee · relaxed denim · low-profile sneakers"],
  ["03", "Soft tech", "utility shell · tonal layers · trail runner"],
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -18 }} viewport={{ amount: 0.35, once: false }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const pageBackground = useTransform(scrollYProgress, [0, 0.45, 1], ["#fcfbf8", "#f8f4e9", "#f4e9bb"]);
  const heroOffset = useTransform(scrollYProgress, [0, 0.28], [0, -80]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  return <motion.main style={{ backgroundColor: pageBackground }} className="min-h-screen overflow-x-hidden text-[#191817] selection:bg-[#e8c862] selection:text-[#191817]">
    <AnimatePresence>{loading && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="fixed inset-0 z-[100] grid place-items-center bg-[#fcfbf8]"><motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-1 text-5xl sm:text-7xl font-semibold tracking-[-0.08em]">{[1, 2, 3, 4].map((number) => <motion.span key={number} initial={{ opacity: 0.18 }} animate={{ opacity: 1 }} transition={{ delay: number * 0.13, duration: 0.18 }} className={number === 4 ? "text-[#d4af37]" : "text-neutral-300"}>{number}</motion.span>)}</motion.div></motion.div>}</AnimatePresence>

    <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-5 py-4 sm:px-8 mix-blend-multiply"><Link href="/" className="text-lg font-semibold tracking-[-0.06em]">aesthio</Link><div className="flex items-center gap-1.5 sm:gap-3"><Link href="/login" className="rounded-xl px-3 py-2 text-sm text-neutral-700 transition hover:bg-black/5">Sign in</Link><Link href="/signup" className="rounded-xl bg-[#191817] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-black">Start discovering</Link></div></nav>

    <section className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
      <motion.div style={{ y: heroOffset }} className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500"><Sparkles className="h-3.5 w-3.5 text-[#b48d1e]" /> visual discovery, made personal</motion.p><motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl text-[clamp(3.7rem,8.5vw,8rem)] font-semibold leading-[0.86] tracking-[-0.085em]">See what<br /><span className="text-[#b48d1e]">you mean.</span></motion.h1><motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }} className="mt-8 max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">From a half-formed outfit idea to a room you want to live in, Aesthio turns your taste into directions worth saving and finding.</motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }} className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-[#191817] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"><WandSparkles className="h-4 w-4" /> Create your direction</Link><a href="#studio" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white/50 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white">Explore the idea <ArrowDownRight className="h-4 w-4" /></a></motion.div></div>
        <motion.div initial={{ opacity: 0, rotate: 4, scale: 0.94 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto h-[420px] w-full max-w-[500px] sm:h-[530px]"><div className="absolute left-[7%] top-[12%] h-[72%] w-[52%] overflow-hidden rounded-[2rem] bg-neutral-200 shadow-2xl"><img src={VISUALS[0]} alt="Dark streetwear inspiration" className="h-full w-full object-cover" /></div><div className="absolute right-[2%] top-0 h-[56%] w-[46%] overflow-hidden rounded-[2rem] border-4 border-[#fcfbf8] bg-neutral-200 shadow-xl"><img src={VISUALS[1]} alt="Modern outfit inspiration" className="h-full w-full object-cover" /></div><div className="absolute bottom-[1%] right-[13%] z-10 w-[50%] rounded-2xl border border-white/60 bg-[#f6e8a8] p-4 shadow-xl"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">Today&apos;s feeling</p><p className="mt-1 text-lg font-semibold leading-tight tracking-[-0.04em]">black + silver, not too serious</p><div className="mt-3 flex -space-x-2">{["#292729", "#d9d9d7", "#c9a438"].map((color) => <span key={color} style={{ backgroundColor: color }} className="h-6 w-6 rounded-full border-2 border-[#f6e8a8]" />)}</div></div></motion.div>
      </motion.div><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">scroll to follow the feeling</motion.p>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><Reveal><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Discovery with a point of view</p><h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Not a feed.<br />A field guide<br />to your taste.</h2></Reveal><Reveal delay={0.1} className="grid grid-cols-2 gap-3 sm:gap-5"><VisualCard src={VISUALS[2]} title="A room with a pulse" className="mt-10" /><VisualCard src={VISUALS[1]} title="A look in motion" /></Reveal></div></section>

    <section id="studio" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-32"><Reveal className="overflow-hidden rounded-[2.25rem] bg-[#1f1d1a] p-6 text-[#fcfbf8] sm:p-12"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e7cb67]"><WandSparkles className="h-4 w-4" /> Aesthio AI Studio</p><h2 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.065em] sm:text-6xl">Start with a sentence. End with a direction.</h2><p className="mt-6 max-w-md leading-relaxed text-neutral-400">Say what you are looking for in your own words. Aesthio maps the aesthetic, context, budget, and product requirements—then gives you distinct ways in.</p><Link href="/signup" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#f1d96d] hover:text-white">Try AI Studio <ArrowUpRight className="h-4 w-4" /></Link></div><div className="rounded-3xl bg-[#f7f2e7] p-4 text-[#191817] sm:p-6"><div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-3 text-sm"><Search className="h-4 w-4 text-neutral-400" /><span>black + silver oversized streetwear under ₹3000</span></div><div className="mt-5 grid gap-3">{exampleLooks.map(([number, title, copy]) => <div key={number} className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4"><span className="text-xs font-semibold text-[#b48d1e]">{number}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-neutral-500">{copy}</p></div></div>)}</div></div></div></Reveal></section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36"><div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><Reveal className="relative h-[420px] overflow-hidden rounded-[2.25rem] sm:h-[560px]"><img src={VISUALS[0]} alt="Editorial streetwear reference" className="h-full w-full object-cover" /><div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/90 p-4 backdrop-blur"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500">Saved to After dark</p><p className="mt-1 font-semibold">The details you&apos;ll actually return to.</p></div><Bookmark className="h-5 w-5" /></div></div></Reveal><Reveal delay={0.12}><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Keep a visual memory</p><h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Save the spark.<br />Build the world around it.</h2><p className="mt-6 max-w-md leading-relaxed text-neutral-600">Collections make the fragments connect: a shoe, a nail color, the warmth of a lamp, an outfit&apos;s silhouette. Your visual vocabulary stays yours.</p><Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white/60 px-5 py-3 text-sm font-medium transition hover:bg-white">Begin a collection <ArrowUpRight className="h-4 w-4" /></Link></Reveal></div></section>

    <section className="px-5 pb-24 sm:px-8"><Reveal className="mx-auto max-w-5xl rounded-[2.4rem] border border-black/5 bg-[#f8f4e9] px-6 py-16 text-center sm:px-12 sm:py-24"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Your next reference starts here</p><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[0.93] tracking-[-0.07em] sm:text-6xl">Your taste is already there. Let&apos;s make it visible.</h2><Link href="/signup" className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-[#191817] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">Start with Aesthio <ArrowUpRight className="h-4 w-4" /></Link></Reveal></section>
    <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-neutral-500 sm:px-8"><span className="font-semibold tracking-[-0.04em] text-neutral-800">aesthio</span><span>Visual discovery for the specific and the curious.</span><span>© 2026</span></footer>
  </motion.main>;
}

function VisualCard({ src, title, className = "" }: { src: string; title: string; className?: string }) {
  return <div className={`relative min-h-64 overflow-hidden rounded-[1.8rem] ${className}`}><img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-sm font-medium text-white">{title}</div></div>;
}
