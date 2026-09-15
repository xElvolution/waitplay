import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: "violet" | "cyan" | "amber" | "emerald";
}) {
  const tones = {
    violet: "bg-violet-500/15 text-violet-200 border-violet-400/30",
    cyan: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
    amber: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
