"use client";

import type { Artifact, PlayerStats, SessionRecord } from "./types";

const SESSIONS_KEY = "waitplay.sessions.v1";
const ARTIFACTS_KEY = "waitplay.artifacts.v1";
const STATS_KEY = "waitplay.stats.v1";

const defaultStats: PlayerStats = {
  xp: 0,
  streak: 0,
  lastPlayDate: null,
  gamesPlayed: 0,
  votesCast: 0,
  bestGameScore: 0,
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getSessions(): SessionRecord[] {
  return readJson<SessionRecord[]>(SESSIONS_KEY, []);
}

export function saveSession(session: SessionRecord): void {
  const next = [session, ...getSessions()].slice(0, 50);
  writeJson(SESSIONS_KEY, next);
}

export function getArtifacts(): Record<string, Artifact> {
  return readJson<Record<string, Artifact>>(ARTIFACTS_KEY, {});
}

export function getArtifact(id: string): Artifact | null {
  return getArtifacts()[id] ?? null;
}

export function saveArtifact(artifact: Artifact): void {
  const all = getArtifacts();
  all[artifact.id] = artifact;
  writeJson(ARTIFACTS_KEY, all);
}

export function getStats(): PlayerStats {
  return readJson<PlayerStats>(STATS_KEY, defaultStats);
}

export function updateStats(
  mutator: (prev: PlayerStats) => PlayerStats
): PlayerStats {
  const next = mutator(getStats());
  writeJson(STATS_KEY, next);
  return next;
}

export function applySessionXp(
  xpGain: number,
  extras?: Partial<Pick<PlayerStats, "gamesPlayed" | "votesCast" | "bestGameScore">>
): PlayerStats {
  const today = new Date().toISOString().slice(0, 10);
  return updateStats((prev) => {
    let streak = prev.streak;
    if (prev.lastPlayDate === today) {
      // same day, keep streak
    } else if (prev.lastPlayDate) {
      const last = new Date(prev.lastPlayDate + "T12:00:00");
      const now = new Date(today + "T12:00:00");
      const diffDays = Math.round(
        (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      );
      streak = diffDays === 1 ? prev.streak + 1 : 1;
    } else {
      streak = 1;
    }

    return {
      xp: prev.xp + xpGain,
      streak,
      lastPlayDate: today,
      gamesPlayed: prev.gamesPlayed + (extras?.gamesPlayed ?? 0),
      votesCast: prev.votesCast + (extras?.votesCast ?? 0),
      bestGameScore: Math.max(
        prev.bestGameScore,
        extras?.bestGameScore ?? 0
      ),
    };
  });
}
