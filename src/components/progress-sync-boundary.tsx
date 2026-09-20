import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";
import { pullAndMergeOnSignIn, schedulePush } from "@/lib/progress-sync/sync";

/**
 * Renders nothing — mounted once near the app root (see `__root.tsx`) purely
 * to keep local progress and the signed-in account's server copy in sync:
 *
 *   1. The moment a real user is known (not "still loading", not signed
 *      out), pull their saved snapshot once, merge it with whatever this
 *      device already has locally, and push the merged result back up.
 *   2. From then on, every store change (answering a question, finishing a
 *      test, resetting progress, …) schedules a debounced push so the server
 *      copy stays current.
 *
 * Signed out (or auth disabled locally), this does nothing — progress stays
 * device-local exactly as it always has.
 */
export function ProgressSyncBoundary() {
  const { user, isPending } = useCurrentUserState();
  const mergedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isPending || !user) return;
    if (mergedForUserId.current === user.id) return;
    mergedForUserId.current = user.id;
    void pullAndMergeOnSignIn();
  }, [isPending, user]);

  useEffect(() => {
    if (isPending || !user) return;
    // Only start pushing changes once this user's initial pull/merge has run,
    // so we never push a pre-merge local snapshot over a newer server copy.
    if (mergedForUserId.current !== user.id) return;
    const unsubscribe = useAppStore.subscribe(() => schedulePush());
    return unsubscribe;
  }, [isPending, user]);

  return null;
}
