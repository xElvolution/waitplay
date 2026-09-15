"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "../ui/Button";

const LINKS = [
  { href: "/#metrics", label: "Metrics" },
  { href: "/#modes", label: "Modes" },
  { href: "/#how", label: "How it works" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#050506]/75 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.45)] transition group-hover:shadow-[0_0_32px_rgba(139,92,246,0.65)]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[15px]">Waitplay</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] text-zinc-400 md:flex">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative transition hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-violet-400 after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/session" className="hidden sm:block">
              <Button size="sm">Open session</Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07] md:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-white/10 bg-[#0a0a0e]/98 px-5 py-5 shadow-[-24px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Menu</span>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1">
                {LINKS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-3 text-base text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <Link href="/session" onClick={() => setOpen(false)} className="mt-4">
                <Button className="w-full" size="lg">
                  Open session
                </Button>
              </Link>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
