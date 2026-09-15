"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070c]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-zinc-950">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>Waitplay</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
          <Link href="/#metrics" className="transition hover:text-white">
            Metrics
          </Link>
          <Link href="/#modes" className="transition hover:text-white">
            Modes
          </Link>
          <Link href="/history" className="transition hover:text-white">
            History
          </Link>
          <Link href="/settings" className="transition hover:text-white">
            Settings
          </Link>
        </nav>
        <Link href="/session">
          <Button size="sm">Open session</Button>
        </Link>
      </div>
    </header>
  );
}
