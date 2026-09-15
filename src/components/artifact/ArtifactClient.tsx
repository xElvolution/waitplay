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
    let cancelled = false;
    const fromQuery = encoded ? decodeArtifact(encoded) : null;
    if (fromQuery) {
      saveArtifact(fromQuery);
      setArtifact(fromQuery);
      return;
    }
    const local = getArtifact(id);
    if (local) {
      setArtifact(local);
      return;
    }
    void fetch(`/api/artifacts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.id) return;
        saveArtifact(data);
        setArtifact(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
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
      <div className="mx-auto max-w-3xl px-3 py-12 text-center sm:px-5">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-10 backdrop-blur-xl">
          <h1 className="text-xl font-semibold tracking-tight text-white">Artifact not found</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            This share link may be incomplete, or the run only exists in another
            browser. Start a fresh wait session and create a new shareable page.
          </p>
          <div className="mt-6">
            <Link href="/session">
              <Button>Go to session</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-3 py-4 sm:px-5 sm:py-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">Shareable artifact</Badge>
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
          <Link href="/session">
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

      <Card className="p-4 sm:p-5">
        <ArtifactBlocks blocks={artifact.blocks} />
      </Card>
    </div>
  );
}
