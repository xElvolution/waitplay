import { getJob } from "@/lib/server/store";
import { subscribeJob } from "@/lib/server/worker";
import type { JobEvent } from "@waitplay/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const job = await getJob(id);
  if (!job) {
    return new Response(JSON.stringify({ error: "Job not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: JobEvent | { type: "hello"; jobId: string }) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      send({ type: "hello", jobId: id });

      // Replay terminal state for late subscribers.
      if (job.status === "completed" && job.artifact) {
        send({
          type: "job.completed",
          jobId: id,
          artifact: job.artifact,
          progress: 1,
          at: job.finishedAt ?? new Date().toISOString(),
        });
        controller.close();
        return;
      }
      if (job.status === "failed") {
        send({
          type: "job.failed",
          jobId: id,
          error: job.error ?? "Job failed",
          progress: job.progress,
          at: job.finishedAt ?? new Date().toISOString(),
        });
        controller.close();
        return;
      }
      if (job.status === "cancelled") {
        send({
          type: "job.cancelled",
          jobId: id,
          progress: job.progress,
          at: job.finishedAt ?? new Date().toISOString(),
        });
        controller.close();
        return;
      }

      unsubscribe = subscribeJob(id, (event) => {
        send(event);
        if (
          event.type === "job.completed" ||
          event.type === "job.failed" ||
          event.type === "job.cancelled"
        ) {
          if (heartbeat) clearInterval(heartbeat);
          controller.close();
        }
      });

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 15000);
    },
    cancel() {
      unsubscribe?.();
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
