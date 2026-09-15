"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import {
  DEMO_PROMPTS,
  buildAgentSteps,
  buildArtifact,
  buildPartialBlocks,
  sleep,
  totalLatency,
} from "@/lib/simulate";
import { createId } from "@/lib/id";
import { encodeArtifact } from "@/lib/encode";
import {
  applySessionXp,
  getStats,
  saveArtifact,
  saveSession,
} from "@/lib/storage";
import type { AgentStep, Artifact, PlayerStats, WaitMode } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AgentProgress } from "./AgentProgress";
import { XPStreak } from "./XPStreak";
import { MicroGame } from "./MicroGame";
import { VoteNextTool } from "./VoteNextTool";
import { ArtifactPreview } from "./ArtifactPreview";
import { MetricsStrip } from "./MetricsStrip";
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

export function DemoExperience() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(DEMO_PROMPTS[0]!);
  const [mode, setMode] = useState<WaitMode>("microgame");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [runMetrics, setRunMetrics] = useState<RunMetrics | null>(null);
  const [liveTtfoMs, setLiveTtfoMs] = useState<number | null>(null);
  const ttfoMarked = useRef(false);
  const ttfoMsRef = useRef<number | null>(null);
  const runStartedAt = useRef<number | null>(null);
  const startedMarked = useRef(false);

  const selectedVoteRef = useRef<string | null>(null);
  const gameScoreRef = useRef(0);
  const votesRef = useRef<Record<string, number>>({});
  const runToken = useRef(0);

  useEffect(() => {
    setStats(getStats());
    setRunMetrics(getRunMetrics());
  }, []);

  useEffect(() => {
    selectedVoteRef.current = selectedVote;
  }, [selectedVote]);

  useEffect(() => {
    gameScoreRef.current = gameScore;
  }, [gameScore]);

  useEffect(() => {
    votesRef.current = votes;
  }, [votes]);

  const partialBlocks = useMemo(
    () => buildPartialBlocks(progress, prompt),
    [progress, prompt]
  );

  const onGameScore = useCallback((score: number) => {
    setGameScore(score);
    setSessionXp(40 + Math.floor(score / 2));
  }, []);

  const seedVotes = useCallback(() => {
    const base: Record<string, number> = {
      web_search: 2,
      code_runner: 1,
      chart_builder: 3,
      doc_draft: 2,
      image_sketch: 1,
      outreach: 0,
    };
    setVotes(base);
    votesRef.current = base;
  }, []);

  const handleVote = useCallback((toolId: string) => {
    if (selectedVoteRef.current) return;
    selectedVoteRef.current = toolId;
    setSelectedVote(toolId);
    setVotes((prev) => {
      const next = { ...prev, [toolId]: (prev[toolId] ?? 0) + 1 };
      votesRef.current = next;
      return next;
    });
    setSessionXp((xp) => Math.max(xp, 60));
  }, []);

  const resetRun = () => {
    if (startedMarked.current && running) {
      setRunMetrics(markRunAbandoned());
      startedMarked.current = false;
    }
    runToken.current += 1;
    setRunning(false);
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
    votesRef.current = {};
    setSelectedVote(null);
    selectedVoteRef.current = null;
    setArtifact(null);
    setSharePath(null);
    setCopied(false);
  };

  const startRun = async () => {
    if (running) return;
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    const token = ++runToken.current;
    setArtifact(null);
    setSharePath(null);
    setCopied(false);
    setProgress(0);
    setSteps([]);
    setGameScore(0);
    gameScoreRef.current = 0;
    setSelectedVote(null);
    selectedVoteRef.current = null;
    setRunning(true);
    setStats(getStats());
    setLiveTtfoMs(null);
    ttfoMarked.current = false;
    ttfoMsRef.current = null;
    runStartedAt.current = Date.now();
    startedMarked.current = true;
    setRunMetrics(markRunStarted());

    if (mode === "vote") {
      seedVotes();
      setSessionXp(25);
    } else if (mode === "microgame") {
      setVotes({});
      votesRef.current = {};
      setSessionXp(40);
    } else {
      setVotes({});
      votesRef.current = {};
      setSessionXp(45);
    }

    // Give voters a short window before steps lock in
    if (mode === "vote") {
      await sleep(1200);
      if (token !== runToken.current) return;
    }

    const voteWinner =
      mode === "vote"
        ? selectedVoteRef.current ??
          Object.entries(votesRef.current).sort((a, b) => b[1] - a[1])[0]?.[0]
        : undefined;

    const agentSteps = buildAgentSteps(voteWinner);
    setSteps(agentSteps.map((s) => ({ ...s })));

    const total = totalLatency(agentSteps);
    let elapsed = 0;
    const toolsUsed: string[] = [];

    for (let i = 0; i < agentSteps.length; i++) {
      if (token !== runToken.current) return;
      const step = agentSteps[i]!;
      toolsUsed.push(step.tool);
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i
            ? { ...s, status: "running" }
            : idx < i
              ? { ...s, status: "done" }
              : s
        )
      );

      const slices = 8;
      for (let s = 1; s <= slices; s++) {
        await sleep(step.durationMs / slices);
        if (token !== runToken.current) return;
        elapsed += step.durationMs / slices;
        const ratio = Math.min(0.99, elapsed / total);
        setProgress(ratio);
        if (!ttfoMarked.current && runStartedAt.current) {
          const useful =
            mode === "preview"
              ? ratio >= 0.18
              : mode === "microgame"
                ? gameScoreRef.current > 0
                : Boolean(selectedVoteRef.current) || ratio >= 0.2;
          if (useful) {
            ttfoMarked.current = true;
            const ms = Date.now() - runStartedAt.current;
            ttfoMsRef.current = ms;
            setLiveTtfoMs(ms);
          }
        }
        if (mode === "preview") {
          setSessionXp(45 + Math.floor(ratio * 40));
        }
      }

      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s))
      );
    }

    if (token !== runToken.current) return;
    setProgress(1);

    const finalScore = gameScoreRef.current;
    const finalVote = selectedVoteRef.current;
    const finalVotes = { ...votesRef.current };

    const xpFromMode =
      mode === "microgame"
        ? 40 + Math.floor(finalScore / 2)
        : mode === "vote"
          ? finalVote
            ? 60
            : 25
          : 85;

    const nextArtifact = buildArtifact({
      prompt: cleanPrompt,
      modePlayed: mode,
      durationMs: Math.round(total),
      xpEarned: xpFromMode,
      toolsUsed: Array.from(new Set(toolsUsed)),
      votes: mode === "vote" ? finalVotes : undefined,
      gameScore: mode === "microgame" ? finalScore : undefined,
    });

    saveArtifact(nextArtifact);
    const ttfoFinal =
      ttfoMsRef.current ??
      (runStartedAt.current
        ? Math.min(Date.now() - runStartedAt.current, Math.round(total * 0.25))
        : Math.round(total * 0.2));
    ttfoMsRef.current = ttfoFinal;
    setLiveTtfoMs(ttfoFinal);
    setRunMetrics(markRunCompleted(ttfoFinal));
    startedMarked.current = false;
    const nextStats = applySessionXp(xpFromMode, {
      gamesPlayed: mode === "microgame" ? 1 : 0,
      votesCast: mode === "vote" && finalVote ? 1 : 0,
      bestGameScore: mode === "microgame" ? finalScore : 0,
    });
    setStats(nextStats);

    saveSession({
      id: createId("ses"),
      prompt: cleanPrompt,
      artifactId: nextArtifact.id,
      createdAt: nextArtifact.createdAt,
      durationMs: nextArtifact.durationMs,
      xpEarned: nextArtifact.xpEarned,
      modePlayed: mode,
      streakAfter: nextStats.streak,
    });

    const encoded = encodeArtifact(nextArtifact);
    const path = `/artifact/${nextArtifact.id}?d=${encoded}`;
    setSharePath(path);
    setArtifact(nextArtifact);
    setSessionXp(xpFromMode);
    setRunning(false);
  };

  const displayXp = artifact?.xpEarned ?? sessionXp;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="violet">Interactive demo</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Run an agent wait session
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Simulated 30s-class multi-tool latency with a live overlay. Track completion rate and time to first useful output while you play, vote, or preview.
          </p>
        </div>
        <Link
          href="/history"
          className="text-sm text-violet-300 hover:text-violet-200"
        >
          Open history
        </Link>
      </div>

      {stats && <XPStreak stats={stats} sessionXp={displayXp} />}
      {runMetrics && (
        <MetricsStrip metrics={runMetrics} liveTtfoMs={liveTtfoMs} />
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
            {DEMO_PROMPTS.map((sample) => (
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
            <Button variant="secondary" onClick={resetRun} disabled={running}>
              <RotateCcw className="h-4 w-4" />
              Reset
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
              <ArtifactPreview blocks={partialBlocks} progress={progress} />
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
