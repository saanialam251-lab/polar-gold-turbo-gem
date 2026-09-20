import type { SyncedProgress } from "./types";

/**
 * Combine this device's local progress with whatever the server already had
 * for this account, favouring whichever side is more informative rather than
 * blindly picking one side — so signing in on a second phone never silently
 * deletes practice done on the first one, and practicing as a guest before
 * creating an account isn't lost either.
 *
 * - Question states: kept per-question, whichever side has the later last
 *   attempt timestamp wins outright (its whole status + attempt history).
 * - Tests: unioned by id (a completed test is immutable once logged), newest
 *   first, capped at 200 so the snapshot can't grow without bound.
 * - Bookmarks: unioned.
 * - Profile: the side with the more recent `savedAt` wins, since it reflects
 *   whichever device the student touched most recently.
 */
export function mergeProgress(local: SyncedProgress, remote: SyncedProgress): SyncedProgress {
  const states = { ...local.states };
  for (const [id, remoteState] of Object.entries(remote.states)) {
    const localState = states[id];
    const remoteLast = remoteState.attempts.at(-1)?.at ?? 0;
    const localLast = localState?.attempts.at(-1)?.at ?? -1;
    if (!localState || remoteLast > localLast) states[id] = remoteState;
  }

  const testsById = new Map(local.tests.map((t) => [t.id, t] as const));
  for (const t of remote.tests) testsById.set(t.id, t);
  const tests = [...testsById.values()].sort((a, b) => b.completedAt - a.completedAt).slice(0, 200);

  const bookmarks = [...new Set([...local.bookmarks, ...remote.bookmarks])];

  const profile = remote.savedAt > local.savedAt ? remote.profile : local.profile;

  return {
    profile,
    states,
    tests,
    bookmarks,
    savedAt: Date.now(),
  };
}
