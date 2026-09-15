# Waitplay

Make Waiting for AI Fun.

Every AI product makes people stare at spinners for 30 to 180 seconds. That dead time is churn. **Waitplay** is the wait layer that turns agent latency into co-steering and micro rewards so more runs finish.

Built for Commons Made by **XElvolution**.

## The pain

Long agent runs feel empty. Users bounce before the artifact lands. Blank progress bars do not create trust, agency, or a reason to stay.

## The product

Waitplay sits on top of the wait:

- **Pulse Tap micro-game** keeps attention with combo XP
- **Vote next tool** lets people co-steer the agent path
- **Partial artifact preview** delivers time to first useful output in seconds
- **XP streaks + session history** make finishing habitual
- **Shareable artifact pages** turn completed waits into something you can send

## Metrics that matter

| Signal | Why it wins |
| --- | --- |
| Completion rate | Did the user finish the agent run? |
| Time to first useful output (TTFO) | How fast did they see something valuable? |

Demo comparisons on the landing page show Waitplay lifting completion versus a blank spinner baseline and cutting TTFO with streamed preview blocks.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo path

1. `/` landing with pain, metrics, and modes
2. `/demo` interactive wait session with simulated agent latency
3. Finish a run and open the shareable `/artifact/[id]` page
4. Revisit sessions on `/history`

## Scripts

- `npm run dev` local development
- `npm run build` production build
- `npm start` serve production build
- `npm run lint` ESLint

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide.

## Author

Sole author: **XElvolution** ([GitHub](https://github.com/xElvolution))

## License

MIT
