"use client";

import { motion } from "framer-motion";
import { Eye, Joystick, Vote } from "lucide-react";
import { Card } from "../ui/Card";

const ease = [0.22, 1, 0.36, 1] as const;

const modes = [
  {
    icon: Joystick,
    title: "Micro-game",
    points: [
      "Tap targets before they fade",
      "Earn XP while the agent still runs",
      "Best score saved to your streak profile",
    ],
  },
  {
    icon: Vote,
    title: "Vote next tool",
    points: [
      "Crowd-pick the next tool in the path",
      "Live tallies update as people vote",
      "Winning tool becomes a visible agent step",
    ],
  },
  {
    icon: Eye,
    title: "Partial preview",
    points: [
      "Stream unfinished artifact blocks",
      "See headings, lists, and code appear live",
      "Finish with a shareable final page",
    ],
  },
];

export function Modes() {
  return (
    <section id="modes" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
            Wait overlay modes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Three ways to spend the think time
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Pick a mode before you run. The overlay stays honest about agent
            progress while giving people something worth doing.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease }}
              whileHover={{
                y: -6,
                boxShadow: "0 24px 60px rgba(139,92,246,0.18)",
              }}
              className="h-full"
            >
              <Card className="group h-full overflow-hidden p-0 transition duration-300 hover:border-violet-400/30">
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-violet-500/25 via-violet-600/10 to-transparent">
                  <motion.div
                    className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-violet-400/20 blur-2xl"
                    animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.15, 1] }}
                    transition={{
                      duration: 4 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <mode.icon className="absolute bottom-4 left-5 h-6 w-6 text-violet-200" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium tracking-tight text-white">
                    {mode.title}
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-zinc-400">
                    {mode.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
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
