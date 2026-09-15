import { NextResponse } from "next/server";
import { listArtifacts, saveArtifact } from "@/lib/server/store";
import type { Artifact } from "@waitplay/sdk";

export const runtime = "nodejs";

export async function GET() {
  const artifacts = await listArtifacts();
  return NextResponse.json({ artifacts });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Artifact;
    if (!body?.id || !body.title || !Array.isArray(body.blocks)) {
      return NextResponse.json({ error: "Invalid artifact" }, { status: 400 });
    }
    const artifact = await saveArtifact(body);
    return NextResponse.json(artifact);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
