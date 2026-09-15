/** Compatibility re-exports - prefer `@waitplay/sdk`. */
export {
  TOOL_OPTIONS,
  STARTER_PROMPTS,
  buildAgentSteps,
  totalLatency,
  buildPartialBlocks,
  buildArtifact,
} from "@waitplay/sdk";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
