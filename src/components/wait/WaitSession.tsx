"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Square } from "lucide-react";
import {
  STARTER_PROMPTS,
  buildPartialBlocks,
  createJobClient,
  type AgentStep,
  type Artifact,
  type ArtifactBlock,
  type JobEvent,
  type WaitMode,
  type WaitplaySettings,
} from "@waitplay/sdk";
import { createId } from "@/lib/id";
import { encodeArtifact } from "@/lib/encode";
import {
  applySessionXp,
  getStats,
  saveArtifact,
  saveSession,
} from "@/lib/storage";
import type { PlayerStats } from "@/lib/types";
import { getOrCreateUserId } from "@/lib/auth";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AgentProgress } from "./AgentProgress";
import { XPStreak } from "./XPStreak";
import { MicroGame } from "./MicroGame";
import { VoteNextTool } from "./VoteNextTool";
import { ArtifactPreview } from "./ArtifactPreview";
import { MetricsStrip } from "./MetricsStrip";
import { ErrorState } from "../error/ErrorState";
import {
  getRunMetrics,
  markRunAbandoned,
  markRunCompleted,
  markRunStarted,
  type RunMetrics,
} from "@/lib/metrics";

const MODE_META: Record<WaitMode, { label: string; blurb: string }> = {
  microgame: {
    label: "Micro-game",
    blurb: "Tap orbs, build combo XP while steps run.",
  },
  vote: {
    label: "Vote next tool",
    blurb: "Pick the next tool and steer the agent path.",
  },
  preview: {
    label: "Partial preview",
    blurb: "Watch the artifact stream block by block.",
  },
};

const client = createJobClient({ baseUrl: "/api" });

export function WaitSession() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<WaitMode>("preview");
  const [settings, setSettings] = useState<WaitplaySettings | null>(null);
  const [running, setRunning] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [partialBlocks, setPartialBlocks] = useState<ArtifactBlock[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [runMetrics, setRunMetrics] = useState<RunMetrics | null>(null);
  const [liveTtfoMs, setLiveTtfoMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const ttfoMarked = useRef(false);
  const ttfoMsRef = useRef<number | null>(null);
  const runStartedAt = useRef<number | null>(null);
  const startedMarked = useRef(false);
  const stopStream = useRef<(() => void) | null>(null);
  const gameScoreRef = useRef(0);
  const selectedVoteRef = useRef<string | null>(null);

  useEffect(() => {
    setStats(getStats());
    setRunMetrics(getRunMetrics());
    void client
      .getSettings()
      .then((s) => {
        setSettings(s);
        setMode(s.defaultMode);
        if (!prompt) setPrompt(STARTER_PROMPTS[0] ?? "");
      })
      .catch(() => {
        if (!prompt) setPrompt(STARTER_PROMPTS[0] ?? "");
      });
    return () => {
      stopStream.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    selectedVoteRef.current = selectedVote;
  }, [selectedVote]);

  useEffect(() => {
    gameScoreRef.current = gameScore;
  }, [gameScore]);

  const previewBlocks = useMemo(() => {
    if (partialBlocks.length > 0) return partialBlocks;
    return buildPartialBlocks(progress, prompt);
  }, [partialBlocks, progress, prompt]);

  const onGameScore = useCallback((score: number) => {
    setGameScore(score);
    setSessionXp(40 + Math.floor(score / 2));
    if (jobId) {
      void client.reportGameScore(jobId, score).catch(() => undefined);
    }
  }, [jobId]);

  const handleVote = useCallback(
    (toolId: string) => {
      if (selectedVoteRef.current) return;
      selectedVoteRef.current = toolId;
      setSelectedVote(toolId);
      setVotes((prev) => {
        const next = { ...prev, [toolId]: (prev[toolId] ?? 0) + 1 };
        return next;
      });
      setSessionXp((xp) => Math.max(xp, 60));
      if (jobId) {
        void client.castVote(jobId, toolId).catch((err) => {
          setStreamError(
            err instanceof Error ? err.message : "Vote failed to sync"
          );
        });
      }
    },
    [jobId]
  );

  const resetLocal = () => {
    setRunning(false);
    setJobId(null);
    setLiveTtfoMs(null);
    ttfoMarked.current = false;
    ttfoMsRef.current = null;
    runStartedAt.current = null;
    setSteps([]);
    setProgress(0);
    setSessionXp(0);
    setGameScore(0);
    gameScoreRef.current = 0;
    setVotes({});
    setSelectedVote(null);
    selectedVoteRef.current = null;
    setArtifact(null);
    setPartialBlocks([]);
    setSharePath(null);
    setCopied(false);
    setError(null);
    setStreamError(null);
  };

  const cancelRun = async () => {
    stopStream.current?.();
    stopStream.current = null;
    if (jobId) {
      try {
        await client.cancelJob(jobId);
      } catch {
        // ignore
      }
    }
    if (startedMarked.current) {
      setRunMetrics(markRunAbandoned());
      startedMarked.current = false;
    }
    resetLocal();
  };

  const applyEvent = useCallback(
    (event: JobEvent) => {
      if (event.type === "job.started") {
        setSteps(event.steps.map((s) => ({ ...s })));
        setRunning(true);
        return;
      }
      if (event.type === "step.started") {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === event.index
              ? { ...s, status: "running" }
              : idx < event.index
                ? { ...s, status: "done" }
                : s
          )
        );
        return;
      }
      if (event.type === "step.progress") {
        setProgress(event.progress);
        if (!ttfoMarked.current && runStartedAt.current) {
          const useful =
            mode === "preview"
              ? event.progress >= 0.18
              : mode === "microgame"
                ? gameScoreRef.current > 0
                : Boolean(selectedVoteRef.current) || event.progress >= 0.2;
          if (useful) {
            ttfoMarked.current = true;
            const ms = Date.now() - runStartedAt.current;
            ttfoMsRef.current = ms;
            setLiveTtfoMs(ms);
          }
        }
        if (mode === "preview") {
          setSessionXp(45 + Math.floor(event.progress * 40));
        }
        return;
      }
      if (event.type === "step.completed") {
        setProgress(event.progress);
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === event.index ? { ...s, status: "done" } : s
          )
        );
        return;
      }
      if (event.type === "artifact.partial") {
        setPartialBlocks(event.blocks);
        setProgress(event.progress);
        return;
      }
      if (event.type === "vote.updated") {
        setVotes(event.votes);
        if (event.selected) {
          setSelectedVote(event.selected);
          selectedVoteRef.current = event.selected;
        }
        return;
      }
      if (event.type === "job.completed") {
        const nextArtifact = event.artifact;
        saveArtifact(nextArtifact);
        const ttfoFinal =
          ttfoMsRef.current ??
          (runStartedAt.current
            ? Math.min(
                Date.now() - runStartedAt.current,
                Math.round(nextArtifact.durationMs * 0.25)
              )
            : Math.round(nextArtifact.durationMs * 0.2));
        ttfoMsRef.current = ttfoFinal;
        setLiveTtfoMs(ttfoFinal);
        setRunMetrics(markRunCompleted(ttfoFinal));
        startedMarked.current = false;

        const nextStats = applySessionXp(nextArtifact.xpEarned, {
          gamesPlayed: mode === "microgame" ? 1 : 0,
          votesCast: mode === "vote" && selectedVoteRef.current ? 1 : 0,
          bestGameScore: mode === "microgame" ? gameScoreRef.current : 0,
        });
        setStats(nextStats);
        saveSession({
          id: createId("ses"),
          prompt: nextArtifact.prompt,
          artifactId: nextArtifact.id,
          createdAt: nextArtifact.createdAt,
          durationMs: nextArtifact.durationMs,
          xpEarned: nextArtifact.xpEarned,
          modePlayed: mode,
          streakAfter: nextStats.streak,
          userId: nextArtifact.userId,
          status: "completed",
          jobId: event.jobId,
        });

        // Best-effort server sync for local cache parity
        void fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: createId("ses"),
            prompt: nextArtifact.prompt,
            artifactId: nextArtifact.id,
            jobId: event.jobId,
            createdAt: nextArtifact.createdAt,
            durationMs: nextArtifact.durationMs,
            xpEarned: nextArtifact.xpEarned,
            modePlayed: mode,
            streakAfter: nextStats.streak,
            userId: nextArtifact.userId,
            status: "completed",
          }),
        }).catch(() => undefined);

        const encoded = encodeArtifact(nextArtifact);
        const path = `/artifact/${nextArtifact.id}?d=${encoded}`;
        setSharePath(path);
        setArtifact(nextArtifact);
        setSessionXp(nextArtifact.xpEarned);
        setProgress(1);
        setRunning(false);
        return;
      }
      if (event.type === "job.failed") {
        setError(event.error);
        setRunning(false);
        if (startedMarked.current) {
          setRunMetrics(markRunAbandoned());
          startedMarked.current = false;
        }
        return;
      }
      if (event.type === "job.cancelled") {
        setRunning(false);
        if (startedMarked.current) {
          setRunMetrics(markRunAbandoned());
          startedMarked.current = false;
        }
      }
    },
    [mode]
  );

  const startRun = async () => {
    if (running) return;
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    stopStream.current?.();
    setError(null);
    setStreamError(null);
    setArtifact(null);
    setSharePath(null);
    setCopied(false);
    setProgress(0);
    setSteps([]);
    setPartialBlocks([]);
    setGameScore(0);
    gameScoreRef.current = 0;
    setSelectedVote(null);
    selectedVoteRef.current = null;
    setVotes({});
    setRunning(true);
    setStats(getStats());
    setLiveTtfoMs(null);
    ttfoMarked.current = false;
    ttfoMsRef.current = null;
    runStartedAt.current = Date.now();
    startedMarked.current = true;
    setRunMetrics(markRunStarted());
    setSessionXp(mode === "vote" ? 25 : mode === "microgame" ? 40 : 45);

    try {
      const userId = getOrCreateUserId();
      const job = await client.createJob({
        prompt: cleanPrompt,
        mode,
        latencyScale: settings?.latencyScale,
        userId,
      });
      setJobId(job.id);
      setSteps(job.steps.map((s) => ({ ...s })));

      stopStream.current = client.stream(
        job.id,
        (event) => applyEvent(event),
        (err) => {
          setStreamError(err.message);
          setRunning(false);
        }
      );
    } catch (err) {
      setRunning(false);
      startedMarked.current = false;
      setError(err instanceof Error ? err.message : "Failed to start job");
    }
  };

  const displayXp = artifact?.xpEarned ?? sessionXp;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="violet">Wait session</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Run an agent wait session
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Local worker streams real multi-tool progress into the wait layer.
            Track completion rate and time to first useful output while you
            play, vote, or preview.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/settings" className="text-zinc-400 hover:text-white">
            Settings
          </Link>
          <Link href="/history" className="text-violet-300 hover:text-violet-200">
            Open history
          </Link>
        </div>
      </div>

      {stats && <XPStreak stats={stats} sessionXp={displayXp} />}
      {runMetrics && (
        <MetricsStrip metrics={runMetrics} liveTtfoMs={liveTtfoMs} />
      )}

      {(error || streamError) && (
        <ErrorState
          title={error ? "Job error" : "Stream error"}
          message={error ?? streamError ?? "Unknown error"}
          onRetry={() => {
            setError(null);
            setStreamError(null);
          }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5 sm:p-6">
          <label className="block text-sm font-medium text-zinc-300">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={running}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-violet-500/40 placeholder:text-zinc-600 focus:ring-2"
            placeholder="What should the agent produce?"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={running}
                onClick={() => setPrompt(sample)}
                className="rounded-full border border-white/10 px-3 py-1 text-left text-xs text-zinc-400 hover:border-white/20 hover:text-zinc-200 disabled:opacity-50"
              >
                {sample.length > 42 ? `${sample.slice(0, 42)}...` : sample}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-300">Wait mode</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(Object.keys(MODE_META) as WaitMode[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled={running}
                  onClick={() => setMode(key)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    mode === key
                      ? "border-violet-400/50 bg-violet-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="text-sm font-medium text-white">
                    {MODE_META[key].label}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {MODE_META[key].blurb}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={startRun} disabled={running || !prompt.trim()}>
              <Play className="h-4 w-4" />
              {running ? "Agent running..." : "Start wait session"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void cancelRun()}
              disabled={!running && !jobId}
            >
              <Square className="h-4 w-4" />
              {running ? "Cancel" : "Clear"}
            </Button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <AgentProgress steps={steps} progress={progress} />
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {mode === "microgame" && (
              <MicroGame active={running} onScore={onGameScore} />
            )}
            {mode === "vote" && (
              <VoteNextTool
                active={running && !selectedVote}
                votes={votes}
                selected={selectedVote}
                onVote={handleVote}
              />
            )}
            {mode === "preview" && (
              <ArtifactPreview blocks={previewBlocks} progress={progress} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {artifact && sharePath && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-emerald-400/20 bg-emerald-500/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="emerald">Artifact ready</Badge>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {artifact.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {artifact.xpEarned} XP earned in{" "}
                  {(artifact.durationMs / 1000).toFixed(1)}s using{" "}
                  {artifact.toolsUsed.join(", ")}.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => router.push(sharePath)}>
                  Open shareable page
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    const url = `${window.location.origin}${sharePath}`;
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  }}
                >
                  {copied ? "Copied" : "Copy share link"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
