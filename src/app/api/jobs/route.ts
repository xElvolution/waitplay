import { NextResponse } from "next/server";
import { clampLatencyScale, type WaitMode } from "@waitplay/sdk";
import { createAndStartJob } from "@/lib/server/worker";
import { getSettings } from "@/lib/server/store";

export const runtime = "nodejs";

const MODES: WaitMode[] = ["microgame", "vote", "preview"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      prompt?: string;
      mode?: WaitMode;
      latencyScale?: number;
      userId?: string;
    };

    const prompt = body.prompt?.trim() ?? "";
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const settings = await getSettings();
    const mode = MODES.includes(body.mode as WaitMode)
      ? (body.mode as WaitMode)
      : settings.defaultMode;
    const latencyScale = clampLatencyScale(
      body.latencyScale ?? settings.latencyScale
    );

    const job = await createAndStartJob({
      prompt,
      mode,
      latencyScale,
      userId: body.userId,
    });

    return NextResponse.json(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
