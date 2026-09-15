"use client";

import { Card } from "../ui/Card";

const steps = [
  {
    n: "01",
    title: "Start a real agent wait",
    body: "Drop in a prompt. The local worker runs multi-tool jobs with real wall-clock timing and streams each step into the wait layer.",
  },
  {
    n: "02",
    title: "Convert dead time into action",
    body: "Play, vote the next tool, or watch partial output. People co-steer instead of abandoning the tab.",
  },
  {
    n: "03",
    title: "Finish and share the artifact",
    body: "Completion rate and time to first useful output improve because the wait itself delivers value. Every run ships a shareable page.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Embed the wait layer. Keep people through the full run.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.n} className="p-6">
              <div className="text-sm font-mono text-violet-300">{step.n}</div>
              <h3 className="mt-3 text-lg font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {step.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
