import type { ArtifactBlock } from "@/lib/types";

export function ArtifactBlocks({
  blocks,
  compact = false,
}: {
  blocks: ArtifactBlock[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          return (
            <h2
              key={key}
              className={
                compact
                  ? "text-base font-semibold text-white"
                  : "text-2xl font-semibold tracking-tight text-white"
              }
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={key} className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={key} className="space-y-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "metric") {
          return (
            <div
              key={key}
              className="mb-2 mr-2 inline-flex min-w-[140px] flex-col rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <span className="text-xs text-zinc-500">{block.label}</span>
              <span className="font-mono text-lg text-violet-300">{block.value}</span>
            </div>
          );
        }
        return (
          <pre
            key={key}
            className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-zinc-300"
          >
            <code>{block.text}</code>
          </pre>
        );
      })}
    </div>
  );
}
