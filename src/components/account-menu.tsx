import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUser } from "@/lib/auth/use-current-user";

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

/**
 * Header chip for a signed-in user: shows the account name (fixed size, long
 * names are cut with "…" so the header layout never shifts) and opens a small
 * menu with "Log out". Logging out lands on the login page.
 */
export function AccountMenu() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gateSession = useSyncExternalStore(
    subscribeToNothing,
    hasGateSessionMarker,
    noGateSessionOnServer,
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = user.displayName ?? user.primaryEmail ?? "Account";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 max-w-[10rem] items-center gap-1.5 rounded-full border border-line bg-paper pl-1 pr-2.5 text-xs font-medium text-ink hover:bg-paper-2"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] text-paper">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="truncate">{name}</span>
        <ChevronDown className="size-3.5 shrink-0 opacity-60" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-56 rounded-lg border border-line bg-paper p-1.5 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            {user.primaryEmail && user.primaryEmail !== name ? (
              <p className="truncate text-xs text-muted">{user.primaryEmail}</p>
            ) : null}
          </div>
          {/* Gate sessions ("Sign in with Grok") re-sign-in on the next request, so no log out there. */}
          {!gateSession ? (
            <>
              <div className="my-1 border-t border-line/80" />
              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  setFailed(false);
                  // Success leaves the page; on failure let the user try again.
                  void signOut("/login").catch(() => {
                    setSigningOut(false);
                    setFailed(true);
                  });
                }}
                className="flex h-10 w-full items-center gap-2 rounded-md px-3 text-sm text-ink hover:bg-paper-2 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut className="size-4" />
                {signingOut ? "Logging out…" : "Log out"}
              </button>
              {failed ? (
                <p className="px-3 pb-1 text-xs text-red-600">Couldn't log out. Please try again.</p>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
          }
