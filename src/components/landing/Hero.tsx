"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Gauge, Share2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, delay, ease },
});

const stats = [
  {
    label: "Completion rate",
    value: "+38%",
    detail: "Lift vs blank spinner baseline",
  },
  {
    label: "Time to first useful output",
    value: "~4.2s",
    detail: "Partial preview beats end-of-run only",
  },
  {
    label: "Wait modes",
    value: "3",
    detail: "Play, vote, or stream while tools run",
  },
];

const pillars = [
  {
    icon: Gauge,
    title: "Measure the wait",
    body: "Track completion rate and time to first useful output on every session.",
  },
  {
    icon: Gamepad2,
    title: "Co-steer the agent",
    body: "Vote the next tool or play while steps run so people stay in the loop.",
  },
  {
    icon: Share2,
    title: "Ship a shareable artifact",
    body: "Every finished run becomes a page you can send, not a discarded spinner.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
      {/* Live micro accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-10%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]"
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[8%] top-32 h-2 w-2 rounded-full bg-violet-400/80 shadow-[0_0_16px_rgba(167,139,250,0.9)]"
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[12%] top-48 h-1.5 w-1.5 rounded-full bg-violet-300/70"
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)} className="mb-6 flex justify-center">
            <Badge tone="violet">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              Wait-layer SDK
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-[2.5rem] font-semibold tracking-[-0.04em] text-white sm:text-6xl sm:leading-[1.05]"
          >
            Stop losing users to the{" "}
            <span className="bg-gradient-to-r from-violet-200 via-violet-300 to-violet-400 bg-clip-text text-transparent">
              30 to 180s
            </span>{" "}
            AI spinner
          </motion.h1>

          <motion.p
            {...fadeUp(0.18)}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Every AI product makes people stare at empty progress. Waitplay turns
            that dead time into co-steering and micro rewards so more runs finish.
            Waiting is the product.
          </motion.p>

          <motion.div
            {...fadeUp(0.28)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/session">
              <Button size="lg" className="min-w-[180px]">
                Start a wait session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#metrics">
              <Button size="lg" variant="secondary" className="min-w-[160px]">
                Proof metrics
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Metric cards stagger */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-3 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.65, delay: 0.38 + i * 0.1, ease }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 0 1px rgba(167,139,250,0.25), 0 20px 50px rgba(139,92,246,0.15)",
              }}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-5 text-left backdrop-blur-xl transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.05]"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {stat.label}
              </div>
              <div className="mt-2.5 font-mono text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </div>
              <p className="mt-1.5 text-sm text-zinc-500 group-hover:text-zinc-400">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Product preview mock */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.55, ease }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="absolute -inset-px rounded-[1.35rem] bg-gradient-to-b from-violet-400/40 via-violet-500/10 to-transparent opacity-70" />
          <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0a0a0e]/90 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 font-mono text-[11px] text-zinc-500">
                waitplay / session
              </span>
              <motion.span
                className="ml-auto flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-medium text-violet-200"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Agent running
              </motion.span>
            </div>
            <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3 border-b border-white/[0.06] p-5 sm:border-b-0 sm:border-r">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  Prompt
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2.5 text-sm text-zinc-300">
                  Draft a launch brief with competitor research and KPI table
                </div>
                <div className="space-y-2 pt-2">
                  {["Research sources", "Draft outline", "Build KPI table"].map(
                    (step, i) => (
                      <motion.div
                        key={step}
                        className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + i * 0.15 }}
                      >
                        <motion.span
                          className={`h-2 w-2 rounded-full ${
                            i < 2 ? "bg-violet-400" : "bg-zinc-600"
                          }`}
                          animate={
                            i === 1
                              ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
                              : undefined
                          }
                          transition={
                            i === 1
                              ? { duration: 1.4, repeat: Infinity }
                              : undefined
                          }
                        />
                        <span className="text-xs text-zinc-300">{step}</span>
                        <span className="ml-auto font-mono text-[10px] text-zinc-600">
                          {i === 0 ? "done" : i === 1 ? "42%" : "queued"}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    Partial preview
                  </span>
                  <span className="font-mono text-[10px] text-violet-300">
                    42% streamed
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-2.5 w-full rounded bg-white/[0.06]" />
                  <div className="h-2.5 w-[88%] rounded bg-white/[0.06]" />
                  <motion.div
                    className="h-2.5 w-[60%] rounded bg-violet-500/25"
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
                      <div className="text-[10px] text-zinc-500">TTFO</div>
                      <div className="font-mono text-sm text-violet-300">4.1s</div>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
                      <div className="text-[10px] text-zinc-500">XP</div>
                      <div className="font-mono text-sm text-white">+62</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pillars */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {pillars.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl transition hover:border-violet-400/25 hover:shadow-[0_16px_48px_rgba(139,92,246,0.12)]"
            >
              <item.icon className="mb-3 h-5 w-5 text-violet-300" />
              <h3 className="font-medium tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
