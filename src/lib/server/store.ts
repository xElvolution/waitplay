import { promises as fs } from "fs";
import path from "path";
import type {
  AgentJob,
  Artifact,
  SessionRecord,
  WaitplaySettings,
} from "@waitplay/sdk";

const DATA_DIR = path.join(process.cwd(), "data");

type StoreShape = {
  jobs: Record<string, AgentJob>;
  artifacts: Record<string, Artifact>;
  sessions: SessionRecord[];
  settings: WaitplaySettings;
};

const defaultSettings = (): WaitplaySettings => ({
  defaultMode: "preview",
  latencyScale: 1,
  displayName: "",
  persistLocally: true,
  streamPartialArtifacts: true,
  authProvider: null,
  updatedAt: new Date().toISOString(),
});

const emptyStore = (): StoreShape => ({
  jobs: {},
  artifacts: {},
  sessions: [],
  settings: defaultSettings(),
});

let memory = emptyStore();
let loaded = false;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function storePath() {
  return path.join(DATA_DIR, "waitplay-store.json");
}

async function load(): Promise<StoreShape> {
  if (loaded) return memory;
  await ensureDir();
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    memory = {
      jobs: parsed.jobs ?? {},
      artifacts: parsed.artifacts ?? {},
      sessions: parsed.sessions ?? [],
      settings: { ...defaultSettings(), ...(parsed.settings ?? {}) },
    };
  } catch {
    memory = emptyStore();
  }
  loaded = true;
  return memory;
}

async function persist() {
  await ensureDir();
  const snapshot = JSON.stringify(memory, null, 2);
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(storePath(), snapshot, "utf8");
  });
  await writeQueue;
}

export async function getStore(): Promise<StoreShape> {
  return load();
}

export async function saveJob(job: AgentJob): Promise<AgentJob> {
  const store = await load();
  store.jobs[job.id] = job;
  await persist();
  return job;
}

export async function getJob(id: string): Promise<AgentJob | null> {
  const store = await load();
  return store.jobs[id] ?? null;
}

export async function saveArtifact(artifact: Artifact): Promise<Artifact> {
  const store = await load();
  store.artifacts[artifact.id] = artifact;
  await persist();
  return artifact;
}

export async function getArtifact(id: string): Promise<Artifact | null> {
  const store = await load();
  return store.artifacts[id] ?? null;
}

export async function listArtifacts(): Promise<Artifact[]> {
  const store = await load();
  return Object.values(store.artifacts).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function saveSession(session: SessionRecord): Promise<SessionRecord> {
  const store = await load();
  store.sessions = [session, ...store.sessions.filter((s) => s.id !== session.id)].slice(
    0,
    200
  );
  await persist();
  return session;
}

export async function listSessions(userId?: string): Promise<SessionRecord[]> {
  const store = await load();
  const all = store.sessions;
  if (!userId) return all;
  return all.filter((s) => !s.userId || s.userId === userId);
}

export async function getSettings(): Promise<WaitplaySettings> {
  const store = await load();
  return store.settings;
}

export async function updateSettings(
  patch: Partial<WaitplaySettings>
): Promise<WaitplaySettings> {
  const store = await load();
  store.settings = {
    ...store.settings,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await persist();
  return store.settings;
}
