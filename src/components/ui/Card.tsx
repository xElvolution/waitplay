import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl ${strong ? "wp-glass-strong" : "wp-glass"} ${className}`}
    >
      {children}
    </div>
  );
}
