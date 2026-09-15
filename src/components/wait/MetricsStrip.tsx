"use client";

import type { RunMetrics } from "@/lib/metrics";
import { avgTtfoMs, completionRate } from "@/lib/metrics";
import { Card } from "../ui/Card";

export function MetricsStrip({
  metrics,
  liveTtfoMs,
}: {
  metrics: RunMetrics;
  liveTtfoMs?: number | null;
}) {
  const rate = completionRate(metrics);
  const avg = avgTtfoMs(metrics);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card className="px-4 py-3">
        <div className="text-xs text-zinc-500">Completion rate</div>
        <div className="mt-1 font-mono text-2xl text-emerald-300">
          {metrics.runsStarted === 0 ? "n/a" : `${Math.round(rate * 100)}%`}
        </div>
        <div className="mt-1 text-xs text-zinc-500">
          {metrics.runsCompleted}/{metrics.runsStarted} finished
        </div>
      </Card>
      <Card className="px-4 py-3">
        <div className="text-xs text-zinc-500">Avg time to first useful output</div>
        <div className="mt-1 font-mono text-2xl text-cyan-300">
          {metrics.ttfoSamples === 0 ? "n/a" : `${(avg / 1000).toFixed(1)}s`}
        </div>
        <div className="mt-1 text-xs text-zinc-500">
          Preview / first reward moment
        </div>
      </Card>
      <Card className="px-4 py-3">
        <div className="text-xs text-zinc-500">This run TTFO</div>
        <div className="mt-1 font-mono text-2xl text-violet-300">
          {liveTtfoMs == null ? "n/a" : `${(liveTtfoMs / 1000).toFixed(1)}s`}
        </div>
        <div className="mt-1 text-xs text-zinc-500">
          Abandons logged: {metrics.abandons}
        </div>
      </Card>
    </div>
  );
}
