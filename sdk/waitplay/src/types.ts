export type WaitMode = "microgame" | "vote" | "preview";

export type AgentStepStatus = "pending" | "running" | "done" | "error";

export type AgentStep = {
  id: string;
  label: string;
  tool: string;
  status: AgentStepStatus;
  durationMs: number;
  errorMessage?: string;
};

export type ArtifactBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "metric"; label: string; value: string };

export type Artifact = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  durationMs: number;
  xpEarned: number;
  modePlayed: WaitMode;
  votes?: Record<string, number>;
  gameScore?: number;
  blocks: ArtifactBlock[];
  toolsUsed: string[];
  userId?: string;
};

export type SessionRecord = {
  id: string;
  prompt: string;
  artifactId: string;
  jobId?: string;
  createdAt: string;
  durationMs: number;
  xpEarned: number;
  modePlayed: WaitMode;
  streakAfter: number;
  userId?: string;
  status?: "completed" | "failed" | "cancelled";
};

export type PlayerStats = {
  xp: number;
  streak: number;
  lastPlayDate: string | null;
  gamesPlayed: number;
  votesCast: number;
  bestGameScore: number;
};

export type ToolOption = {
  id: string;
  name: string;
  description: string;
  icon: "search" | "code" | "image" | "chart" | "mail" | "file";
};

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AgentJob = {
  id: string;
  prompt: string;
  mode: WaitMode;
  status: JobStatus;
  steps: AgentStep[];
  progress: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  votedTool?: string;
  votes: Record<string, number>;
  artifactId?: string;
  artifact?: Artifact;
  error?: string;
  userId?: string;
  latencyScale: number;
  gameScore?: number;
  xpEarned?: number;
};

export type JobEvent =
  | { type: "job.started"; jobId: string; steps: AgentStep[]; at: string }
  | {
      type: "step.started";
      jobId: string;
      stepId: string;
      index: number;
      at: string;
    }
  | {
      type: "step.progress";
      jobId: string;
      stepId: string;
      index: number;
      progress: number;
      at: string;
    }
  | {
      type: "step.completed";
      jobId: string;
      stepId: string;
      index: number;
      progress: number;
      at: string;
    }
  | {
      type: "artifact.partial";
      jobId: string;
      progress: number;
      blocks: ArtifactBlock[];
      at: string;
    }
  | {
      type: "job.completed";
      jobId: string;
      artifact: Artifact;
      progress: number;
      at: string;
    }
  | {
      type: "job.failed";
      jobId: string;
      error: string;
      progress: number;
      at: string;
    }
  | {
      type: "job.cancelled";
      jobId: string;
      progress: number;
      at: string;
    }
  | {
      type: "vote.updated";
      jobId: string;
      votes: Record<string, number>;
      selected?: string;
      at: string;
    };

export type CreateJobInput = {
  prompt: string;
  mode: WaitMode;
  votedTool?: string;
  latencyScale?: number;
  userId?: string;
};

export type WaitplaySettings = {
  defaultMode: WaitMode;
  latencyScale: number;
  displayName: string;
  persistLocally: boolean;
  streamPartialArtifacts: boolean;
  /** Auth-ready: optional provider id once wired (e.g. "clerk", "privy"). */
  authProvider: string | null;
  updatedAt: string;
};
