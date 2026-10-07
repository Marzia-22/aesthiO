"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Grid2X2, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", label: "Feed", Icon: Grid2X2 },
  { href: "/explore", label: "Explore", Icon: Compass },
  { href: "/moodboard", label: "Studio", Icon: Sparkles },
  { href: "/profile", label: "Profile", Icon: UserRound },
];

export function MobileNav() {
  const pathname = usePathname();
  return <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-neutral-200 bg-[#FDFBF7]/95 px-1 py-2 shadow-[0_12px_32px_rgba(35,29,20,0.16)] backdrop-blur md:hidden">
    {items.map(({ href, label, Icon }) => <Link key={href} href={href} className={cn("flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors", pathname === href ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900")}><Icon className="h-4 w-4" />{label}</Link>)}
  </nav>;
}
