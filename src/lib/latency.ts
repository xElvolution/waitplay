import { clampLatencyScale } from "@waitplay/sdk";

export function latencyScale(): number {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_LATENCY_SCALE
      : undefined;
  const n = raw ? Number(raw) : 1;
  return clampLatencyScale(n);
}
