import type {
  AgentJob,
  CreateJobInput,
  JobEvent,
  WaitplaySettings,
} from "./types";

export type JobClientOptions = {
  baseUrl?: string;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
};

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export function createJobClient(options: JobClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? "/api").replace(/\/$/, "");

  async function headers(): Promise<HeadersInit> {
    const extra = options.getHeaders ? await options.getHeaders() : {};
    return {
      "Content-Type": "application/json",
      ...extra,
    };
  }

  return {
    async createJob(input: CreateJobInput): Promise<AgentJob> {
      const res = await fetch(`${baseUrl}/jobs`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(input),
      });
      return parseJson<AgentJob>(res);
    },

    async getJob(jobId: string): Promise<AgentJob> {
      const res = await fetch(`${baseUrl}/jobs/${jobId}`, {
        headers: await headers(),
      });
      return parseJson<AgentJob>(res);
    },

    async cancelJob(jobId: string): Promise<AgentJob> {
      const res = await fetch(`${baseUrl}/jobs/${jobId}`, {
        method: "DELETE",
        headers: await headers(),
      });
      return parseJson<AgentJob>(res);
    },

    async castVote(jobId: string, toolId: string): Promise<AgentJob> {
      const res = await fetch(`${baseUrl}/jobs/${jobId}`, {
        method: "PATCH",
        headers: await headers(),
        body: JSON.stringify({ action: "vote", toolId }),
      });
      return parseJson<AgentJob>(res);
    },

    async reportGameScore(jobId: string, score: number): Promise<AgentJob> {
      const res = await fetch(`${baseUrl}/jobs/${jobId}`, {
        method: "PATCH",
        headers: await headers(),
        body: JSON.stringify({ action: "score", score }),
      });
      return parseJson<AgentJob>(res);
    },

    stream(
      jobId: string,
      onEvent: (event: JobEvent) => void,
      onError?: (error: Error) => void
    ): () => void {
      const source = new EventSource(`${baseUrl}/jobs/${jobId}/events`);
      source.onmessage = (msg) => {
        try {
          const raw = JSON.parse(msg.data) as { type?: string };
          if (!raw?.type || raw.type === "hello") return;
          const event = raw as JobEvent;
          onEvent(event);
          if (
            event.type === "job.completed" ||
            event.type === "job.failed" ||
            event.type === "job.cancelled"
          ) {
            source.close();
          }
        } catch (err) {
          onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      };
      source.onerror = () => {
        if (source.readyState === EventSource.CLOSED) return;
        onError?.(new Error("Lost connection to job stream"));
        source.close();
      };
      return () => source.close();
    },

    async getSettings(): Promise<WaitplaySettings> {
      const res = await fetch(`${baseUrl}/settings`, {
        headers: await headers(),
      });
      return parseJson<WaitplaySettings>(res);
    },

    async updateSettings(
      patch: Partial<WaitplaySettings>
    ): Promise<WaitplaySettings> {
      const res = await fetch(`${baseUrl}/settings`, {
        method: "PUT",
        headers: await headers(),
        body: JSON.stringify(patch),
      });
      return parseJson<WaitplaySettings>(res);
    },
  };
}

export type JobClient = ReturnType<typeof createJobClient>;
