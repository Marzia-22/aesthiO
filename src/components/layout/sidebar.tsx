"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed", icon: "⊞", label: "Feed" },
  { href: "/reels", icon: "▶", label: "Reels" },
  { href: "/moodboard", icon: "◈", label: "AI Studio" },
  { href: "/explore", icon: "◎", label: "Explore" },
  { href: "/profile", icon: "○", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
<aside className="fixed left-0 top-0 hidden h-full w-56 bg-[#FDFBF7] border-r border-neutral-100 md:flex flex-col z-40">      {/* Logo */}
      <div className="px-6 py-6 border-b border-neutral-100">
        <span className="text-2xl font-extrabold tracking-tight text-black">
  aesthio
</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-neutral-100 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200"
        >
          <span>⚙</span>
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <span>→</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
