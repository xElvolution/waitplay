import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ArtifactClient } from "@/components/artifact/ArtifactClient";

export const metadata = {
  title: "Shared artifact | Waitplay",
  description: "A shareable Waitplay agent result.",
};

function ArtifactFallback() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-zinc-400 sm:px-6">
      Loading artifact...
    </div>
  );
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell>
      <Suspense fallback={<ArtifactFallback />}>
        <ArtifactClient id={id} />
      </Suspense>
    </AppShell>
  );
}
