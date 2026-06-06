"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const FLOATING_CARDS = [
  { label: "minimal aesthetic", color: "bg-stone-100", delay: 0 },
  { label: "dark academia", color: "bg-neutral-800 text-white", delay: 0.1 },
  { label: "soft girl summer", color: "bg-pink-50", delay: 0.2 },
  { label: "techwear fits", color: "bg-zinc-900 text-white", delay: 0.3 },
  { label: "cottagecore vibes", color: "bg-green-50", delay: 0.4 },
  { label: "y2k aesthetic", color: "bg-purple-50", delay: 0.5 },
];

const FEATURES = [
  {
    icon: "✦",
    title: "AI Moodboards",
    desc: "Type a vibe, get a full aesthetic board. Powered by vision AI.",
  },
  {
    icon: "◈",
    title: "Product Detection",
    desc: "See something you like? AI finds where to buy it instantly.",
  },
  {
    icon: "⬡",
    title: "Creator Monetization",
    desc: "Earn from affiliate links, premium boards, and aesthetic packs.",
  },
  {
    icon: "◎",
    title: "Reels & Discovery",
    desc: "Scroll vertical video content curated to your exact aesthetic.",
  },
];

const STATS = [
  { value: "2.4M+", label: "Inspirations saved" },
  { value: "180K+", label: "Creators" },
  { value: "94%", label: "Match accuracy" },
];

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-neutral-900 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#FDFBF7]/80 backdrop-blur-sm border-b border-neutral-100">
        <span className="text-lg font-semibold tracking-tight">aesthio</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-neutral-400 mb-6 px-4 py-2 border border-neutral-200 rounded-full">
            AI-powered aesthetic discovery
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
        >
          Your aesthetic,
          <br />
          <span className="text-neutral-400">curated by AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Discover fashion, design, and lifestyle content tailored to your vibe.
          Save inspirations, build moodboards, and shop what you love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 active:scale-[0.98] transition-all"
          >
            Sign in
          </Link>
        </motion.div>
      </section>

      {/* Floating aesthetic tags */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {FLOATING_CARDS.map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: card.delay }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`px-5 py-2.5 rounded-2xl text-sm font-medium cursor-default border border-neutral-100 ${card.color}`}
              >
                {card.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Everything you need
            </h2>
            <p className="text-neutral-500 mt-3 text-lg">
              Built for the next generation of aesthetic creators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-8 rounded-2xl border transition-all duration-300 cursor-default ${
                  hoveredFeature === i
                    ? "border-neutral-300 bg-white shadow-sm"
                    : "border-neutral-100 bg-white/50"
                }`}
              >
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-neutral-900 rounded-3xl p-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to find your aesthetic?
          </h2>
          <p className="text-neutral-400 mb-8 text-lg">
            Join thousands of creators already on aesthio.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 bg-white text-neutral-900 text-sm font-medium rounded-xl hover:bg-neutral-100 active:scale-[0.98] transition-all"
          >
            Create free account
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-medium">aesthio</span>
          <p className="text-xs text-neutral-400">
            © 2026 aesthio. Built for creators.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Terms</a>
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}