"use client";

import { motion } from "framer-motion";
import type { ArtifactBlock } from "@/lib/types";
import { ArtifactBlocks } from "../artifact/ArtifactBlocks";

export function ArtifactPreview({
  blocks,
  progress,
}: {
  blocks: ArtifactBlock[];
  progress: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-white">Partial artifact preview</h3>
          <p className="text-sm text-zinc-400">
            Blocks stream in as the agent finishes each step.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-xs text-cyan-300">
          {Math.round(progress * 100)}% streamed
        </span>
      </div>
      <div className="relative max-h-72 overflow-auto rounded-2xl border border-white/10 bg-[#0b0b14] p-4">
        <ArtifactBlocks blocks={blocks} compact />
        {progress < 1 && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b14] to-transparent"
            animate={{ opacity: [0.55, 0.9, 0.55] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        )}
      </div>
    </div>
  );
}
