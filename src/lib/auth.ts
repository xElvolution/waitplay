/**
 * Auth-ready identity helpers.
 * Today: anonymous durable user id.
 * Tomorrow: swap resolveUserId() to your provider (Clerk, Privy, NextAuth, etc.).
 */

const USER_KEY = "waitplay.userId.v1";

export type AuthIdentity = {
  userId: string;
  displayName: string | null;
  provider: string | null;
  isAnonymous: boolean;
};

export function createAnonymousUserId(): string {
  const raw =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `anon_${raw.slice(0, 16)}`;
}

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(USER_KEY);
    if (existing) return existing;
    const id = createAnonymousUserId();
    window.localStorage.setItem(USER_KEY, id);
    return id;
  } catch {
    return createAnonymousUserId();
  }
}

export function resolveIdentity(displayName?: string | null): AuthIdentity {
  const userId = getOrCreateUserId();
  return {
    userId,
    displayName: displayName?.trim() || null,
    provider: null,
    isAnonymous: true,
  };
}

/** Placeholder for future provider wiring. */
export async function signInWithProvider(
  _provider: string
): Promise<{ ok: false; reason: string }> {
  return {
    ok: false,
    reason: "Auth provider not connected yet. Identity remains anonymous.",
  };
}
