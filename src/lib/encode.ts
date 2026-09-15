import type { Artifact } from "./types";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const full = b64 + pad;
  if (typeof atob !== "undefined") {
    const binary = atob(full);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(full, "base64"));
}

export function encodeArtifact(artifact: Artifact): string {
  const json = JSON.stringify(artifact);
  if (typeof TextEncoder !== "undefined") {
    return toBase64Url(new TextEncoder().encode(json));
  }
  return toBase64Url(Buffer.from(json, "utf8"));
}

export function decodeArtifact(payload: string): Artifact | null {
  try {
    const bytes = fromBase64Url(payload);
    const json =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder().decode(bytes)
        : Buffer.from(bytes).toString("utf8");
    const parsed = JSON.parse(json) as Artifact;
    if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.blocks)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
