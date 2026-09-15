"use client";

import { motion } from "framer-motion";
import { Eye, Joystick, Vote } from "lucide-react";
import { Card } from "../ui/Card";

const modes = [
  {
    icon: Joystick,
    title: "Micro-game",
    tone: "from-violet-500/30 to-fuchsia-500/10",
    points: [
      "Tap targets before they fade",
      "Earn XP while the agent still runs",
      "Best score saved to your streak profile",
    ],
  },
  {
    icon: Vote,
    title: "Vote next tool",
    tone: "from-cyan-500/30 to-emerald-500/10",
    points: [
      "Crowd-pick the next tool in the path",
      "Live tallies update as people vote",
      "Winning tool becomes a visible agent step",
    ],
  },
  {
    icon: Eye,
    title: "Partial preview",
    tone: "from-amber-500/30 to-orange-500/10",
    points: [
      "Stream unfinished artifact blocks",
      "See headings, lists, and code appear live",
      "Finish with a shareable final page",
    ],
  },
];

export function Modes() {
  return (
    <section id="modes" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Wait overlay modes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Three ways to spend the think time
          </h2>
          <p className="mt-3 text-zinc-400">
            Pick a mode before you run. The overlay stays honest about agent
            progress while giving people something worth doing.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full overflow-hidden p-0">
                <div className={`h-28 bg-gradient-to-br ${mode.tone}`} />
                <div className="p-5">
                  <mode.icon className="mb-3 h-5 w-5 text-white" />
                  <h3 className="text-lg font-medium text-white">{mode.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                    {mode.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
