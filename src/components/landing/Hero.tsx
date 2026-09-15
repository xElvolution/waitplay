"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Gauge, Share2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[280px] w-[280px] rounded-full bg-cyan-400/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="violet">Wait-layer SDK</Badge>
            <Badge tone="cyan">Make Waiting for AI Fun</Badge>
            <Badge tone="amber">Dead time is churn</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl sm:leading-[1.05]">
            Stop losing users to the 30 to 180s AI spinner
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Every AI product makes people stare at empty progress. Waitplay
            turns that dead time into co-steering and micro rewards so more
            runs finish. Waiting is the product.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/session">
              <Button size="lg">Start a wait session</Button>
            </Link>
            <Link href="/#metrics">
              <Button size="lg" variant="secondary">
                Proof metrics
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3"
        >
          {[
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
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left"
            >
              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                {stat.label}
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold text-white">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-zinc-400">{stat.detail}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {[
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
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left"
            >
              <item.icon className="mb-3 h-5 w-5 text-violet-300" />
              <h3 className="font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
