import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: "violet" | "muted" | "success" | "danger";
}) {
  const tones = {
    violet: "bg-violet-500/12 text-violet-200 border-violet-400/25",
    muted: "bg-white/[0.04] text-zinc-300 border-white/10",
    success: "bg-emerald-500/12 text-emerald-200 border-emerald-400/25",
    danger: "bg-rose-500/12 text-rose-200 border-rose-400/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
