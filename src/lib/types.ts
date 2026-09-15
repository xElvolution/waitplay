export type WaitMode = "microgame" | "vote" | "preview";

export type AgentStep = {
  id: string;
  label: string;
  tool: string;
  status: "pending" | "running" | "done";
  durationMs: number;
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
};

export type SessionRecord = {
  id: string;
  prompt: string;
  artifactId: string;
  createdAt: string;
  durationMs: number;
  xpEarned: number;
  modePlayed: WaitMode;
  streakAfter: number;
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
