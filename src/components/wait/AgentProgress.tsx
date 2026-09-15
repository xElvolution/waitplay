"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { AgentStep } from "@/lib/types";

export function AgentProgress({
  steps,
  progress,
}: {
  steps: AgentStep[];
  progress: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-300">Agent progress</span>
        <span className="font-mono text-violet-300">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress * 100)}%` }}
          transition={{ ease: "easeOut", duration: 0.35 }}
        />
      </div>
      <ul className="space-y-2">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
              {step.status === "done" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : step.status === "running" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-300" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-200">{step.label}</p>
              <p className="truncate font-mono text-[11px] text-zinc-500">
                {step.tool}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
