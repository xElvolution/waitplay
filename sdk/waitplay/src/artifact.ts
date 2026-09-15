import { createId } from "./id";
import type { Artifact, ArtifactBlock, WaitMode } from "./types";

export function blocksForPrompt(
  prompt: string,
  toolsUsed: string[]
): ArtifactBlock[] {
  const trimmed = prompt.trim();
  const short =
    trimmed.length > 72 ? `${trimmed.slice(0, 69).trimEnd()}...` : trimmed;

  return [
    {
      type: "heading",
      text: `Result for: ${short}`,
    },
    {
      type: "paragraph",
      text: `Waitplay kept you engaged while the agent worked. The run used ${toolsUsed.length} tools and returned a ready-to-share artifact instead of a blank spinner.`,
    },
    {
      type: "metric",
      label: "Tools in the path",
      value: String(toolsUsed.length),
    },
    {
      type: "metric",
      label: "Wait converted",
      value: "Play + preview",
    },
    {
      type: "list",
      items: [
        "Intent parsed into clear steps the UI can show live.",
        "Partial preview streamed so waiting felt like progress.",
        "Crowd vote and micro-game XP layered on top of latency.",
        "Final artifact packaged for one-click share.",
      ],
    },
    {
      type: "code",
      language: "markdown",
      text: [
        `# ${short}`,
        "",
        "## What happened",
        `- Prompt: ${trimmed}`,
        `- Tools: ${toolsUsed.join(", ")}`,
        "",
        "## Takeaway",
        "Waiting for AI does not have to feel empty. Make the wait the product.",
      ].join("\n"),
    },
    {
      type: "paragraph",
      text: "Share this page with your team. They can reopen the artifact and start their own Waitplay session.",
    },
  ];
}

export function buildPartialBlocks(
  progress: number,
  prompt: string
): ArtifactBlock[] {
  const all = blocksForPrompt(prompt, ["planner", "web_search", "doc_draft"]);
  const count = Math.max(
    1,
    Math.ceil(all.length * Math.min(1, Math.max(0.15, progress)))
  );
  return all.slice(0, count);
}

export function buildArtifact(input: {
  prompt: string;
  modePlayed: WaitMode;
  durationMs: number;
  xpEarned: number;
  toolsUsed: string[];
  votes?: Record<string, number>;
  gameScore?: number;
  userId?: string;
}): Artifact {
  return {
    id: createId("art"),
    title: input.prompt.trim().slice(0, 80) || "Untitled Waitplay run",
    prompt: input.prompt.trim(),
    createdAt: new Date().toISOString(),
    durationMs: input.durationMs,
    xpEarned: input.xpEarned,
    modePlayed: input.modePlayed,
    votes: input.votes,
    gameScore: input.gameScore,
    blocks: blocksForPrompt(input.prompt, input.toolsUsed),
    toolsUsed: input.toolsUsed,
    userId: input.userId,
  };
}

export function computeXp(input: {
  mode: WaitMode;
  gameScore?: number;
  voted?: boolean;
}): number {
  if (input.mode === "microgame") {
    return 40 + Math.floor((input.gameScore ?? 0) / 2);
  }
  if (input.mode === "vote") {
    return input.voted ? 60 : 25;
  }
  return 85;
}
