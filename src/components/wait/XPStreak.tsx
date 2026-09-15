"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import type { PlayerStats } from "@/lib/types";

export function XPStreak({
  stats,
  sessionXp,
}: {
  stats: PlayerStats;
  sessionXp: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        {
          label: "Total XP",
          value: stats.xp + sessionXp,
          icon: Star,
          tone: "text-amber-300",
        },
        {
          label: "Streak",
          value: `${stats.streak}d`,
          icon: Flame,
          tone: "text-orange-300",
        },
        {
          label: "This wait",
          value: `+${sessionXp}`,
          icon: Star,
          tone: "text-violet-300",
        },
        {
          label: "Best score",
          value: stats.bestGameScore,
          icon: Flame,
          tone: "text-cyan-300",
        },
      ].map((item) => (
        <motion.div
          key={item.label}
          layout
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
        >
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <item.icon className={`h-3.5 w-3.5 ${item.tone}`} />
            {item.label}
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            {item.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
