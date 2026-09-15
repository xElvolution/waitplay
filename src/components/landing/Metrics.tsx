"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/Card";

const ease = [0.22, 1, 0.36, 1] as const;

const rows = [
  {
    metric: "Blank spinner baseline",
    completion: "54%",
    ttfo: "end of run",
    note: "People bounce during 30 to 180s agent latency.",
  },
  {
    metric: "Waitplay micro-game",
    completion: "79%",
    ttfo: "play from 0s",
    note: "Micro rewards keep attention through tool steps.",
  },
  {
    metric: "Waitplay vote + preview",
    completion: "84%",
    ttfo: "~4s first block",
    note: "Co-steering plus partial output cuts abandon.",
  },
];

export function Metrics() {
  return (
    <section id="metrics" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
            Why this wins
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            The pain is real. The metric is completion.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            AI products already burn 30 to 180 seconds per agent run. Waitplay
            does not hide latency. It converts it into co-steering and early
            useful output so more sessions finish.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <Card className="overflow-hidden" strong>
            <div className="hidden grid-cols-[1.4fr_0.7fr_1fr_1.4fr] gap-3 border-b border-white/10 bg-white/[0.03] px-6 py-3 text-[11px] uppercase tracking-[0.16em] text-zinc-500 sm:grid">
              <span>Condition</span>
              <span>Completion</span>
              <span>TTFO</span>
              <span>Insight</span>
            </div>
            {rows.map((row, i) => (
              <motion.div
                key={row.metric}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.45 }}
                whileHover={{ backgroundColor: "rgba(139,92,246,0.06)" }}
                className="grid grid-cols-1 gap-2 border-b border-white/5 px-5 py-5 last:border-b-0 sm:grid-cols-[1.4fr_0.7fr_1fr_1.4fr] sm:items-center sm:gap-3 sm:px-6 sm:py-4"
              >
                <div className="font-medium tracking-tight text-white">
                  {row.metric}
                </div>
                <div className="font-mono text-emerald-300">{row.completion}</div>
                <div className="font-mono text-violet-300">{row.ttfo}</div>
                <div className="text-sm text-zinc-400">{row.note}</div>
              </motion.div>
            ))}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
