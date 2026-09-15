"use client";

export type RunMetrics = {
  runsStarted: number;
  runsCompleted: number;
  abandons: number;
  totalTtfoMs: number;
  ttfoSamples: number;
};

const KEY = "waitplay.metrics.v1";

const empty: RunMetrics = {
  runsStarted: 0,
  runsCompleted: 0,
  abandons: 0,
  totalTtfoMs: 0,
  ttfoSamples: 0,
};

function read(): RunMetrics {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as RunMetrics) };
  } catch {
    return empty;
  }
}

function write(next: RunMetrics): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function getRunMetrics(): RunMetrics {
  return read();
}

export function markRunStarted(): RunMetrics {
  const next = { ...read(), runsStarted: read().runsStarted + 1 };
  write(next);
  return next;
}

export function markRunCompleted(ttfoMs: number): RunMetrics {
  const prev = read();
  const next: RunMetrics = {
    ...prev,
    runsCompleted: prev.runsCompleted + 1,
    totalTtfoMs: prev.totalTtfoMs + Math.max(0, ttfoMs),
    ttfoSamples: prev.ttfoSamples + 1,
  };
  write(next);
  return next;
}

export function markRunAbandoned(): RunMetrics {
  const next = { ...read(), abandons: read().abandons + 1 };
  write(next);
  return next;
}

export function completionRate(m: RunMetrics): number {
  if (m.runsStarted === 0) return 0;
  return m.runsCompleted / m.runsStarted;
}

export function avgTtfoMs(m: RunMetrics): number {
  if (m.ttfoSamples === 0) return 0;
  return m.totalTtfoMs / m.ttfoSamples;
}
