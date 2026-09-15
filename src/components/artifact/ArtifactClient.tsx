"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, ExternalLink } from "lucide-react";
import { decodeArtifact } from "@/lib/encode";
import { getArtifact, saveArtifact } from "@/lib/storage";
import type { Artifact } from "@/lib/types";
import { ArtifactBlocks } from "./ArtifactBlocks";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const MODE_LABEL = {
  microgame: "Micro-game",
  vote: "Vote next tool",
  preview: "Partial preview",
} as const;

export function ArtifactClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [copied, setCopied] = useState(false);

  const encoded = searchParams.get("d");

  useEffect(() => {
    const fromQuery = encoded ? decodeArtifact(encoded) : null;
    if (fromQuery) {
      saveArtifact(fromQuery);
      setArtifact(fromQuery);
      return;
    }
    setArtifact(getArtifact(id));
  }, [encoded, id]);

  const meta = useMemo(() => {
    if (!artifact) return null;
    return [
      { label: "Duration", value: `${(artifact.durationMs / 1000).toFixed(1)}s` },
      { label: "XP earned", value: String(artifact.xpEarned) },
      { label: "Mode", value: MODE_LABEL[artifact.modePlayed] },
      { label: "Tools", value: artifact.toolsUsed.join(", ") },
    ];
  }, [artifact]);

  if (!artifact) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-white">Artifact not found</h1>
        <p className="mt-3 text-zinc-400">
          This share link may be incomplete, or the run only exists in another
          browser. Start a fresh demo and create a new shareable page.
        </p>
        <div className="mt-6">
          <Link href="/demo">
            <Button>Go to demo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="emerald">Shareable artifact</Badge>
          <Badge tone="violet">{MODE_LABEL[artifact.modePlayed]}</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          {artifact.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Created {new Date(artifact.createdAt).toLocaleString()} · Prompt:{" "}
          {artifact.prompt}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Link href="/demo">
            <Button size="sm">
              Run your own wait
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {meta && (
        <div className="grid gap-3 sm:grid-cols-2">
          {meta.map((item) => (
            <Card key={item.label} className="px-4 py-3">
              <div className="text-xs text-zinc-500">{item.label}</div>
              <div className="mt-1 text-sm font-medium text-zinc-100">
                {item.value}
              </div>
            </Card>
          ))}
        </div>
      )}

      {typeof artifact.gameScore === "number" && (
        <Card className="px-4 py-3">
          <div className="text-xs text-zinc-500">Pulse Tap score</div>
          <div className="mt-1 font-mono text-xl text-violet-300">
            {artifact.gameScore}
          </div>
        </Card>
      )}

      {artifact.votes && (
        <Card className="p-4">
          <div className="text-sm font-medium text-white">Tool vote tallies</div>
          <div className="mt-3 space-y-2">
            {Object.entries(artifact.votes)
              .sort((a, b) => b[1] - a[1])
              .map(([tool, count]) => (
                <div
                  key={tool}
                  className="flex items-center justify-between text-sm text-zinc-300"
                >
                  <span className="font-mono text-xs text-zinc-400">{tool}</span>
                  <span>{count}</span>
                </div>
              ))}
          </div>
        </Card>
      )}

      <Card className="p-5 sm:p-6">
        <ArtifactBlocks blocks={artifact.blocks} />
      </Card>
    </div>
  );
}
