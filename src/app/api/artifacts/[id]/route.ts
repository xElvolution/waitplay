import { NextResponse } from "next/server";
import { getArtifact } from "@/lib/server/store";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const artifact = await getArtifact(id);
  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }
  return NextResponse.json(artifact);
}
