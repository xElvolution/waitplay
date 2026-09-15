"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createJobClient,
  type WaitMode,
  type WaitplaySettings,
} from "@waitplay/sdk";
import { getOrCreateUserId, signInWithProvider } from "@/lib/auth";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ErrorState } from "../error/ErrorState";

const client = createJobClient({ baseUrl: "/api" });

const MODES: Array<{ id: WaitMode; label: string }> = [
  { id: "microgame", label: "Micro-game" },
  { id: "vote", label: "Vote next tool" },
  { id: "preview", label: "Partial preview" },
];

export function SettingsClient() {
  const [settings, setSettings] = useState<WaitplaySettings | null>(null);
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authNote, setAuthNote] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getOrCreateUserId());
    void client
      .getSettings()
      .then(setSettings)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load settings")
      );
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const next = await client.updateSettings(settings);
      setSettings(next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!settings && !error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-zinc-400 sm:px-6">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-3 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="violet">Settings</Badge>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Settings
          </h1>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Tune wait defaults, timing, and identity. Auth providers plug in without changing the wait layer.
          </p>
        </div>
        <Link href="/session" className="text-xs text-violet-300 hover:text-violet-200 sm:text-sm">
          Open session
        </Link>
      </div>

      {error && (
        <ErrorState
          title="Settings error"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {settings && (
        <>
          <Card className="space-y-5 p-5 sm:p-6">
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Display name
              </label>
              <input
                value={settings.displayName}
                onChange={(e) =>
                  setSettings({ ...settings, displayName: e.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-violet-500/40 focus:ring-2"
                placeholder="Optional name shown on artifacts"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">
                Default wait mode
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, defaultMode: m.id })
                    }
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      settings.defaultMode === m.id
                        ? "border-violet-400/50 bg-violet-500/15 text-white"
                        : "border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">
                Latency scale ({settings.latencyScale.toFixed(2)}x)
              </label>
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.25}
                value={settings.latencyScale}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    latencyScale: Number(e.target.value),
                  })
                }
                className="mt-3 w-full accent-violet-400"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Scales real wall-clock step timing in the local worker. 1x is
                about 30 to 45 seconds per run.
              </p>
            </div>

            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={settings.streamPartialArtifacts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    streamPartialArtifacts: e.target.checked,
                  })
                }
                className="accent-violet-400"
              />
              Stream partial artifact blocks during preview mode
            </label>

            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={settings.persistLocally}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    persistLocally: e.target.checked,
                  })
                }
                className="accent-violet-400"
              />
              Mirror sessions to this browser for offline reopen
            </label>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void save()} disabled={saving}>
                {saving ? "Saving..." : saved ? "Saved" : "Save settings"}
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="muted">Auth-ready</Badge>
              <span className="text-sm text-zinc-400">
                Anonymous identity active
              </span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                User id
              </div>
              <code className="mt-1 block break-all font-mono text-sm text-violet-300">
                {userId}
              </code>
            </div>
            <p className="text-sm text-zinc-400">
              Jobs and sessions already accept a <code>userId</code>. Connect
              Clerk, Privy, or NextAuth by resolving the signed-in user in{" "}
              <code>src/lib/auth.ts</code> and passing that id into the job
              client.
            </p>
            <div className="flex flex-wrap gap-3">
              {["clerk", "privy", "next-auth"].map((provider) => (
                <Button
                  key={provider}
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    const result = await signInWithProvider(provider);
                    setAuthNote(result.reason);
                    setSettings({ ...settings, authProvider: provider });
                  }}
                >
                  Connect {provider}
                </Button>
              ))}
            </div>
            {authNote && (
              <p className="text-sm text-amber-200/90">{authNote}</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
