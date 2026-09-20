import { useSyncExternalStore } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  getLocalAccount,
  isLocalAuth,
  readSessionEmail,
  subscribeSession,
} from "@/lib/local-auth/local-auth";

export type AppUserInfo = { name: string; email: string | null };

/**
 * The signed-in user, wherever the app runs:
 *  - Android app -> the on-device account (no server exists inside the APK)
 *  - website     -> the real server session (Better Auth)
 */
export function useAppUser(): { user: AppUserInfo | null; isPending: boolean } {
  const remote = useCurrentUserState();
  const localEmail = useSyncExternalStore(subscribeSession, readSessionEmail, () => null);

  if (isLocalAuth()) {
    const account = localEmail ? getLocalAccount(localEmail) : null;
    return { user: account, isPending: false };
  }
  return {
    user: remote.user
      ? {
          name: remote.user.displayName ?? remote.user.primaryEmail ?? "Account",
          email: remote.user.primaryEmail,
        }
      : null,
    isPending: remote.isPending,
  };
}
