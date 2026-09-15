"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  History,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const NAV = [
  { href: "/session", label: "Session", icon: Clock3 },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
  dense,
}: {
  href: string;
  label: string;
  icon: typeof Clock3;
  active: boolean;
  onNavigate?: () => void;
  dense?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl transition ${
        dense ? "px-3 py-2.5 text-sm" : "px-3 py-2 text-[13px]"
      } ${
        active
          ? "bg-violet-500/15 text-white shadow-[inset_0_0_0_1px_rgba(167,139,250,0.25)]"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
      }`}
    >
      <Icon className={`shrink-0 ${active ? "text-violet-300" : "text-zinc-500"} ${dense ? "h-4 w-4" : "h-4 w-4"}`} />
      <span className="font-medium tracking-tight">{label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex min-h-full flex-1">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#07070a]/90 px-3 py-4 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Waitplay
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              App
            </div>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={isActive(item.href)}
            />
          ))}
        </nav>
        <Link
          href="/"
          className="mt-auto rounded-xl px-3 py-2 text-[12px] text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-300"
        >
          Back to marketing
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile / tablet top bar */}
        <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#050506]/85 px-3 backdrop-blur-xl lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-white">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-sm font-semibold">Waitplay</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="Open app menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              id={panelId}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col border-r border-white/10 bg-[#0a0a0e]/98 px-3 py-4 shadow-[24px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-white">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-semibold">App</span>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    dense
                    active={isActive(item.href)}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </nav>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mt-auto rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:text-zinc-300"
              >
                Marketing site
              </Link>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
