# Waitplay

Make Waiting for AI Fun.

Every AI product makes people stare at spinners for 30 to 180 seconds. That dead time is churn. **Waitplay** is the wait-layer SDK + app that turns agent latency into co-steering and micro rewards so more runs finish.

Built by **XElvolution**.

## The product

Waitplay sits on top of the wait:

- **Reusable `@waitplay/sdk`** — job client, step plans, artifacts, XP helpers
- **Local worker** — real wall-clock multi-tool jobs with SSE progress streaming
- **Pulse Tap micro-game** keeps attention with combo XP
- **Vote next tool** lets people co-steer the agent path
- **Partial artifact preview** delivers time to first useful output in seconds
- **Persisted sessions + settings** with auth-ready identity hooks
- **Shareable artifact pages** turn completed waits into something you can send

## Metrics that matter

| Signal | Why it wins |
| --- | --- |
| Completion rate | Did the user finish the agent run? |
| Time to first useful output (TTFO) | How fast did they see something valuable? |

## Quick start

```bash
cp .env.example .env.local
npm install
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product path

1. `/` landing with pain, metrics, and modes
2. `/session` wait session backed by the streaming worker
3. Finish a run and open the shareable `/artifact/[id]` page
4. Revisit sessions on `/history`
5. Tune timing and identity on `/settings`

## SDK

```bash
# linked in this repo
npm install @waitplay/sdk
```

```ts
import { createJobClient, buildAgentSteps } from "@waitplay/sdk";

const client = createJobClient({ baseUrl: "/api" });
const job = await client.createJob({ prompt, mode: "preview" });
client.stream(job.id, (event) => {
  // update your overlay
});
```

## Scripts

- `npm run dev` local development
- `npm run build` production build
- `npm start` serve production build
- `npm run lint` ESLint

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide, `@waitplay/sdk`.

## Author

Sole author: **XElvolution** ([GitHub](https://github.com/xElvolution))

## License

MIT
