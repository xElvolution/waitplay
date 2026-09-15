"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Code2,
  FileText,
  Image as ImageIcon,
  Mail,
  Search,
} from "lucide-react";
import { TOOL_OPTIONS } from "@/lib/simulate";
import type { ToolOption } from "@/lib/types";

const ICONS = {
  search: Search,
  code: Code2,
  chart: BarChart3,
  file: FileText,
  image: ImageIcon,
  mail: Mail,
} as const;

export function VoteNextTool({
  active,
  votes,
  selected,
  onVote,
}: {
  active: boolean;
  votes: Record<string, number>;
  selected: string | null;
  onVote: (toolId: string) => void;
}) {
  const total = useMemo(
    () => Object.values(votes).reduce((a, b) => a + b, 0) || 1,
    [votes]
  );

  const options: ToolOption[] = TOOL_OPTIONS;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium text-white">Vote the next tool</h3>
        <p className="text-sm text-zinc-400">
          Cast one vote. The leading tool jumps into the live agent path.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((tool) => {
          const Icon = ICONS[tool.icon];
          const count = votes[tool.id] ?? 0;
          const pct = Math.round((count / total) * 100);
          const isSelected = selected === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              disabled={!active || Boolean(selected)}
              onClick={() => onVote(tool.id)}
              className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-violet-400/60 bg-violet-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              } disabled:cursor-default`}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-violet-500/10"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.35 }}
              />
              <div className="relative flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                  <Icon className="h-4 w-4 text-cyan-300" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white">{tool.name}</p>
                    <span className="font-mono text-xs text-zinc-400">
                      {pct}%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
