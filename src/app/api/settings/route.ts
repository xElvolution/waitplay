import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/server/store";
import { clampLatencyScale, type WaitMode, type WaitplaySettings } from "@waitplay/sdk";

export const runtime = "nodejs";

const MODES: WaitMode[] = ["microgame", "vote", "preview"];

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<WaitplaySettings>;
    const patch: Partial<WaitplaySettings> = {};

    if (body.defaultMode && MODES.includes(body.defaultMode)) {
      patch.defaultMode = body.defaultMode;
    }
    if (typeof body.latencyScale === "number") {
      patch.latencyScale = clampLatencyScale(body.latencyScale);
    }
    if (typeof body.displayName === "string") {
      patch.displayName = body.displayName.slice(0, 64);
    }
    if (typeof body.persistLocally === "boolean") {
      patch.persistLocally = body.persistLocally;
    }
    if (typeof body.streamPartialArtifacts === "boolean") {
      patch.streamPartialArtifacts = body.streamPartialArtifacts;
    }
    if (body.authProvider === null || typeof body.authProvider === "string") {
      patch.authProvider = body.authProvider;
    }

    const settings = await updateSettings(patch);
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
