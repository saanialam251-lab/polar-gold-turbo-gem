import { useAppStore } from "@/lib/store";
import { mergeProgress } from "./merge";
import { pullProgress, pushProgress } from "./server-fn";
import type { SyncedProgress } from "./types";

function snapshotLocal(): SyncedProgress {
  const s = useAppStore.getState();
  return { profile: s.profile, states: s.states, tests: s.tests, bookmarks: s.bookmarks, savedAt: Date.now() };
}

function applyToStore(p: SyncedProgress) {
  useAppStore.setState({ profile: p.profile, states: p.states, tests: p.tests, bookmarks: p.bookmarks });
}

/**
 * Run once right after sign-in resolves to a real user (see
 * `<ProgressSyncBoundary>`): pull whatever the server already has for this
 * account, merge it with this device's current local/guest progress, apply
 * the merged result locally, and push the merge back up so the server is
 * immediately consistent too.
 */
export async function pullAndMergeOnSignIn(): Promise<void> {
  const local = snapshotLocal();
  let remote: SyncedProgress | null = null;
  try {
    const res = await pullProgress();
    remote = res?.data ?? null;
  } catch {
    // Offline or a transient error — keep local progress as-is; the next
    // debounced push (or the next sign-in) will retry.
    return;
  }
  const merged = remote ? mergeProgress(local, remote) : local;
  applyToStore(merged);
  try {
    await pushProgress({ data: merged });
  } catch {
    /* will retry on the next debounced push */
  }
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced push of the current local state, called on every store change while signed in. */
export function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushProgress({ data: snapshotLocal() }).catch(() => {
      /* will retry on the next change */
    });
  }, 2000);
}
