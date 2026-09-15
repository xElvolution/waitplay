export function latencyScale(): number {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_LATENCY_SCALE
      : undefined;
  const n = raw ? Number(raw) : 1;
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.min(3, Math.max(0.25, n));
}
