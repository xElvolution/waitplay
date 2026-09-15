"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

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
    <section id="how" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Embed the wait layer. Keep people through the full run.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full p-6 transition hover:border-violet-400/25">
                <div className="font-mono text-sm text-violet-300">{step.n}</div>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.body}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="mt-16 flex flex-col items-center rounded-3xl border border-white/[0.08] bg-gradient-to-b from-violet-500/10 to-transparent px-6 py-12 text-center"
        >
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Ready to convert dead time?
          </h3>
          <p className="mt-3 max-w-md text-sm text-zinc-400">
            Open a wait session and watch completion climb while the agent still
            thinks.
          </p>
          <Link href="/session" className="mt-7">
            <Button size="lg">
              Start a wait session
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
