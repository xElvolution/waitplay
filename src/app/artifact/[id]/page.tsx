import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArtifactClient } from "@/components/artifact/ArtifactClient";

export const metadata = {
  title: "Shared artifact | Waitplay",
  description: "A shareable Waitplay agent result.",
};

function ArtifactFallback() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-zinc-400 sm:px-6">
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
    <>
      <Navbar />
      <main className="flex-1 pb-10">
        <Suspense fallback={<ArtifactFallback />}>
          <ArtifactClient id={id} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
