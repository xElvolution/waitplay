import { NextResponse } from "next/server";
import { listSessions, saveSession } from "@/lib/server/store";
import type { SessionRecord } from "@waitplay/sdk";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId") ?? undefined;
  const sessions = await listSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SessionRecord;
    if (!body?.id || !body.prompt || !body.artifactId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
    const session = await saveSession(body);
    return NextResponse.json(session);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
