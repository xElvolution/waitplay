"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Flame, Sparkles } from "lucide-react";
import { encodeArtifact } from "@/lib/encode";
import { getArtifact, getSessions, getStats } from "@/lib/storage";
import type { PlayerStats, SessionRecord } from "@/lib/types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { XPStreak } from "./XPStreak";

const MODE_LABEL: Record<SessionRecord["modePlayed"], string> = {
  microgame: "Micro-game",
  vote: "Vote next tool",
  preview: "Partial preview",
};

export function HistoryClient() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    setSessions(getSessions());
    setStats(getStats());
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="cyan">Session history</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Your Waitplay runs
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Stored in this browser. Reopen any artifact or start a fresh demo
            session whenever you want.
          </p>
        </div>
        <Link href="/demo">
          <Button>New session</Button>
        </Link>
      </div>

      {stats && <XPStreak stats={stats} sessionXp={0} />}

      {sessions.length === 0 ? (
        <Card className="p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-violet-300" />
          <h2 className="mt-4 text-lg font-medium text-white">
            No sessions yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Run the interactive demo once and your waits, XP, and artifacts will
            show up here.
          </p>
          <div className="mt-6">
            <Link href="/demo">
              <Button>Launch demo</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const artifact = getArtifact(session.artifactId);
            const href = artifact
              ? `/artifact/${artifact.id}?d=${encodeArtifact(artifact)}`
              : `/demo`;
            return (
              <Card key={session.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="violet">
                        {MODE_LABEL[session.modePlayed]}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {(session.durationMs / 1000).toFixed(1)}s
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                        <Flame className="h-3.5 w-3.5" />
                        streak {session.streakAfter}d
                      </span>
                    </div>
                    <h2 className="mt-2 truncate text-base font-medium text-white sm:text-lg">
                      {session.prompt}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(session.createdAt).toLocaleString()} · +
                      {session.xpEarned} XP
                    </p>
                  </div>
                  <Link href={href}>
                    <Button variant="secondary" size="sm">
                      Open artifact
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
