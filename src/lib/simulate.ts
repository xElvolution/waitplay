import { createId } from "./id";
import { latencyScale } from "./latency";
import type { AgentStep, Artifact, ArtifactBlock, ToolOption, WaitMode } from "./types";

export const TOOL_OPTIONS: ToolOption[] = [
  {
    id: "web_search",
    name: "Web Search",
    description: "Pull fresh facts and citations for the answer.",
    icon: "search",
  },
  {
    id: "code_runner",
    name: "Code Runner",
    description: "Execute snippets and verify edge cases.",
    icon: "code",
  },
  {
    id: "chart_builder",
    name: "Chart Builder",
    description: "Turn numbers into a clear visual summary.",
    icon: "chart",
  },
  {
    id: "doc_draft",
    name: "Doc Draft",
    description: "Shape a polished write-up from notes.",
    icon: "file",
  },
  {
    id: "image_sketch",
    name: "Image Sketch",
    description: "Produce a simple visual mock for the idea.",
    icon: "image",
  },
  {
    id: "outreach",
    name: "Outreach Draft",
    description: "Write a short message ready to send.",
    icon: "mail",
  },
];

const STEP_TEMPLATES: Array<Omit<AgentStep, "id" | "status">> = [
  { label: "Parse intent and constraints", tool: "planner", durationMs: 900 },
  { label: "Gather supporting context", tool: "web_search", durationMs: 1600 },
  { label: "Draft structured outline", tool: "doc_draft", durationMs: 1200 },
  { label: "Validate claims and numbers", tool: "code_runner", durationMs: 1400 },
  { label: "Polish final artifact", tool: "doc_draft", durationMs: 1100 },
];

export function buildAgentSteps(votedTool?: string): AgentStep[] {
  const scale = latencyScale();
  const steps = STEP_TEMPLATES.map((step) => ({
    ...step,
    durationMs: Math.round(step.durationMs * scale),
    id: createId("step"),
    status: "pending" as const,
  }));

  if (votedTool) {
    const idx = Math.min(2, steps.length - 1);
    const match = TOOL_OPTIONS.find((t) => t.id === votedTool);
    steps[idx] = {
      ...steps[idx]!,
      tool: votedTool,
      label: match
        ? `Run crowd pick: ${match.name}`
        : `Run crowd pick: ${votedTool}`,
      durationMs: 1500,
    };
  }

  return steps;
}

export function totalLatency(steps: AgentStep[]): number {
  return steps.reduce((sum, s) => sum + s.durationMs, 0);
}

function blocksForPrompt(prompt: string, toolsUsed: string[]): ArtifactBlock[] {
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
      text: "Share this page with your team. They can replay the vibe and open their own Waitplay session from the landing page.",
    },
  ];
}

export function buildPartialBlocks(
  progress: number,
  prompt: string
): ArtifactBlock[] {
  const all = blocksForPrompt(prompt, ["planner", "web_search", "doc_draft"]);
  const count = Math.max(1, Math.ceil(all.length * Math.min(1, Math.max(0.15, progress))));
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
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DEMO_PROMPTS = [
  "Plan a 48-hour launch checklist for a wait-layer AI product",
  "Draft a pitch that turns agent latency into engagement XP",
  "Design a wait overlay that mixes micro-games and live previews",
  "Write a Commons Made demo script for Waitplay in under two minutes",
];
