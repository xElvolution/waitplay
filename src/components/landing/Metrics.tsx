"use client";

import { Card } from "../ui/Card";

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
    <section id="metrics" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
            Why this wins
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            The pain is real. The metric is completion.
          </h2>
          <p className="mt-3 text-zinc-400">
            AI products already burn 30 to 180 seconds per agent run. Waitplay
            does not hide latency. It converts it into co-steering and early
            useful output so more sessions finish.
          </p>
        </div>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1.4fr_0.7fr_1fr_1.4fr] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.14em] text-zinc-500 sm:px-6">
            <span>Condition</span>
            <span>Completion</span>
            <span>TTFO</span>
            <span className="hidden sm:block">Insight</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.metric}
              className="grid grid-cols-1 gap-2 border-b border-white/5 px-4 py-4 last:border-b-0 sm:grid-cols-[1.4fr_0.7fr_1fr_1.4fr] sm:items-center sm:gap-3 sm:px-6"
            >
              <div className="font-medium text-white">{row.metric}</div>
              <div className="font-mono text-emerald-300">{row.completion}</div>
              <div className="font-mono text-cyan-300">{row.ttfo}</div>
              <div className="text-sm text-zinc-400">{row.note}</div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
