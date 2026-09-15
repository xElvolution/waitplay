import {
  buildAgentSteps,
  buildArtifact,
  buildPartialBlocks,
  computeXp,
  createId,
  type AgentJob,
  type JobEvent,
  type WaitMode,
} from "@waitplay/sdk";
import { getJob, saveArtifact, saveJob, saveSession } from "./store";

type Listener = (event: JobEvent) => void;

const listeners = new Map<string, Set<Listener>>();
const cancelFlags = new Map<string, boolean>();
const running = new Set<string>();

function emit(jobId: string, event: JobEvent) {
  const set = listeners.get(jobId);
  if (!set) return;
  for (const listener of set) {
    try {
      listener(event);
    } catch {
      // ignore listener errors
    }
  }
}

export function subscribeJob(jobId: string, listener: Listener): () => void {
  let set = listeners.get(jobId);
  if (!set) {
    set = new Set();
    listeners.set(jobId, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) listeners.delete(jobId);
  };
}

function sleep(ms: number, jobId: string): Promise<"ok" | "cancelled"> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (cancelFlags.get(jobId)) {
        resolve("cancelled");
        return;
      }
      if (Date.now() - started >= ms) {
        resolve("ok");
        return;
      }
      setTimeout(tick, Math.min(100, ms - (Date.now() - started)));
    };
    tick();
  });
}

export async function createAndStartJob(input: {
  prompt: string;
  mode: WaitMode;
  latencyScale: number;
  userId?: string;
}): Promise<AgentJob> {
  const cleanPrompt = input.prompt.trim();
  if (!cleanPrompt) {
    throw new Error("Prompt is required");
  }

  const steps = buildAgentSteps(undefined, input.latencyScale);
  const job: AgentJob = {
    id: createId("job"),
    prompt: cleanPrompt,
    mode: input.mode,
    status: "queued",
    steps,
    progress: 0,
    createdAt: new Date().toISOString(),
    votes: {},
    userId: input.userId,
    latencyScale: input.latencyScale,
  };

  await saveJob(job);
  void runJob(job.id);
  return job;
}

export async function requestCancel(jobId: string): Promise<AgentJob | null> {
  cancelFlags.set(jobId, true);
  const job = await getJob(jobId);
  if (!job) return null;
  if (job.status === "completed" || job.status === "failed") return job;
  const next: AgentJob = {
    ...job,
    status: "cancelled",
    finishedAt: new Date().toISOString(),
  };
  await saveJob(next);
  emit(jobId, {
    type: "job.cancelled",
    jobId,
    progress: next.progress,
    at: new Date().toISOString(),
  });
  return next;
}

export async function castJobVote(
  jobId: string,
  toolId: string
): Promise<AgentJob | null> {
  const job = await getJob(jobId);
  if (!job) return null;
  if (job.status !== "queued" && job.status !== "running") return job;
  if (job.votedTool) return job;

  const votes = { ...job.votes, [toolId]: (job.votes[toolId] ?? 0) + 1 };
  const next: AgentJob = {
    ...job,
    votes,
    votedTool: toolId,
  };
  await saveJob(next);
  emit(jobId, {
    type: "vote.updated",
    jobId,
    votes,
    selected: toolId,
    at: new Date().toISOString(),
  });
  return next;
}

export async function setJobScore(
  jobId: string,
  score: number
): Promise<AgentJob | null> {
  const job = await getJob(jobId);
  if (!job) return null;
  const next: AgentJob = { ...job, gameScore: Math.max(0, Math.floor(score)) };
  await saveJob(next);
  return next;
}

async function runJob(jobId: string) {
  if (running.has(jobId)) return;
  running.add(jobId);
  cancelFlags.set(jobId, false);

  try {
    let job = await getJob(jobId);
    if (!job) return;

    // Vote window: give voters a real second before locking the plan.
    if (job.mode === "vote") {
      const wait = await sleep(1500, jobId);
      if (wait === "cancelled") return;
      job = (await getJob(jobId))!;
      const steps = buildAgentSteps(job.votedTool, job.latencyScale);
      job = {
        ...job,
        steps,
        status: "running",
        startedAt: new Date().toISOString(),
      };
    } else {
      job = {
        ...job,
        status: "running",
        startedAt: new Date().toISOString(),
      };
    }

    await saveJob(job);
    emit(jobId, {
      type: "job.started",
      jobId,
      steps: job.steps,
      at: new Date().toISOString(),
    });

    const total = job.steps.reduce((sum, s) => sum + s.durationMs, 0) || 1;
    let elapsed = 0;
    const toolsUsed: string[] = [];

    for (let i = 0; i < job.steps.length; i++) {
      if (cancelFlags.get(jobId)) return;
      job = (await getJob(jobId))!;
      const step = job.steps[i]!;
      toolsUsed.push(step.tool);

      job.steps = job.steps.map((s, idx) =>
        idx === i
          ? { ...s, status: "running" }
          : idx < i
            ? { ...s, status: "done" }
            : s
      );
      await saveJob(job);
      emit(jobId, {
        type: "step.started",
        jobId,
        stepId: step.id,
        index: i,
        at: new Date().toISOString(),
      });

      const sliceMs = 250;
      let remaining = step.durationMs;
      while (remaining > 0) {
        if (cancelFlags.get(jobId)) return;
        const chunk = Math.min(sliceMs, remaining);
        const result = await sleep(chunk, jobId);
        if (result === "cancelled") return;
        remaining -= chunk;
        elapsed += chunk;
        const progress = Math.min(0.99, elapsed / total);
        job = (await getJob(jobId))!;
        job.progress = progress;
        await saveJob(job);
        emit(jobId, {
          type: "step.progress",
          jobId,
          stepId: step.id,
          index: i,
          progress,
          at: new Date().toISOString(),
        });
        if (job.mode === "preview") {
          emit(jobId, {
            type: "artifact.partial",
            jobId,
            progress,
            blocks: buildPartialBlocks(progress, job.prompt),
            at: new Date().toISOString(),
          });
        }
      }

      job = (await getJob(jobId))!;
      job.steps = job.steps.map((s, idx) =>
        idx === i ? { ...s, status: "done" } : s
      );
      await saveJob(job);
      emit(jobId, {
        type: "step.completed",
        jobId,
        stepId: step.id,
        index: i,
        progress: job.progress,
        at: new Date().toISOString(),
      });
    }

    job = (await getJob(jobId))!;
    const xp = computeXp({
      mode: job.mode,
      gameScore: job.gameScore,
      voted: Boolean(job.votedTool),
    });
    const durationMs = Math.round(total);
    const artifact = buildArtifact({
      prompt: job.prompt,
      modePlayed: job.mode,
      durationMs,
      xpEarned: xp,
      toolsUsed: Array.from(new Set(toolsUsed)),
      votes: job.mode === "vote" ? job.votes : undefined,
      gameScore: job.mode === "microgame" ? job.gameScore : undefined,
      userId: job.userId,
    });

    await saveArtifact(artifact);
    await saveSession({
      id: createId("ses"),
      prompt: job.prompt,
      artifactId: artifact.id,
      jobId: job.id,
      createdAt: artifact.createdAt,
      durationMs,
      xpEarned: xp,
      modePlayed: job.mode,
      streakAfter: 0,
      userId: job.userId,
      status: "completed",
    });

    job = {
      ...job,
      status: "completed",
      progress: 1,
      finishedAt: new Date().toISOString(),
      artifactId: artifact.id,
      artifact,
      xpEarned: xp,
    };
    await saveJob(job);
    emit(jobId, {
      type: "job.completed",
      jobId,
      artifact,
      progress: 1,
      at: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Worker failed";
    const job = await getJob(jobId);
    if (!job) return;
    const next: AgentJob = {
      ...job,
      status: "failed",
      error: message,
      finishedAt: new Date().toISOString(),
    };
    await saveJob(next);
    emit(jobId, {
      type: "job.failed",
      jobId,
      error: message,
      progress: next.progress,
      at: new Date().toISOString(),
    });
  } finally {
    running.delete(jobId);
    cancelFlags.delete(jobId);
  }
}
