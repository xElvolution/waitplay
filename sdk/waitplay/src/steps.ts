import { createId } from "./id";
import type { AgentStep, ToolOption } from "./types";

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

/** Production-class multi-tool plan (~30–45s at scale 1). */
const STEP_TEMPLATES: Array<Omit<AgentStep, "id" | "status">> = [
  { label: "Parse intent and constraints", tool: "planner", durationMs: 4500 },
  { label: "Gather supporting context", tool: "web_search", durationMs: 9000 },
  { label: "Draft structured outline", tool: "doc_draft", durationMs: 7000 },
  { label: "Validate claims and numbers", tool: "code_runner", durationMs: 8000 },
  { label: "Polish final artifact", tool: "doc_draft", durationMs: 6500 },
];

export function clampLatencyScale(n: number | undefined): number {
  if (!Number.isFinite(n) || !n || n <= 0) return 1;
  return Math.min(3, Math.max(0.25, n));
}

export function buildAgentSteps(
  votedTool?: string,
  latencyScale = 1
): AgentStep[] {
  const scale = clampLatencyScale(latencyScale);
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
        ? `Run selected tool: ${match.name}`
        : `Run selected tool: ${votedTool}`,
      durationMs: Math.round(7500 * scale),
    };
  }

  return steps;
}

export function totalLatency(steps: AgentStep[]): number {
  return steps.reduce((sum, s) => sum + s.durationMs, 0);
}

export const STARTER_PROMPTS = [
  "Plan a 48-hour launch checklist for a wait-layer AI product",
  "Draft a pitch that turns agent latency into engagement XP",
  "Design a wait overlay that mixes micro-games and live previews",
  "Write an integration guide for embedding Waitplay in an agent app",
];
