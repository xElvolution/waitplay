# @waitplay/sdk

Reusable wait-layer primitives for AI agent products.

Use this package to:

- define multi-step agent job plans with real wall-clock timing
- stream progress events into any host UI
- compute XP, partial artifact previews, and completion metrics
- mount Waitplay overlay modes (micro-game, vote, preview) in your own app

## Install

```bash
npm install @waitplay/sdk
```

In this monorepo the package is linked as `file:./sdk/waitplay`.

## Core API

```ts
import {
  buildAgentSteps,
  buildArtifact,
  createJobClient,
  TOOL_OPTIONS,
} from "@waitplay/sdk";

const client = createJobClient({ baseUrl: "/api" });
const job = await client.createJob({ prompt, mode: "preview" });
for await (const event of client.stream(job.id)) {
  // update overlay from step / progress / artifact events
}
```

## Overlay contract

Host apps render their own chrome. Feed streamed `JobEvent`s into Waitplay UI components (`WaitSession`, `AgentProgress`, mode overlays) or your own wait layer.

## Auth-ready

Job and session records accept an optional `userId`. Wire your auth provider and pass the resolved identity when creating jobs.
