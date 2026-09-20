import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { SyncedProgress } from "./types";

/**
 * Load this signed-in user's saved snapshot, or null if they've never synced
 * before (brand-new account, or an account that only ever practiced signed
 * out). `context.userId` comes from the verified session — never trust a
 * client-supplied id.
 */
export const pullProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ data: SyncedProgress } | null> => {
    const sql = await getSql();
    const rows = await sql<{ data: SyncedProgress }>`
      select data from progress_snapshot where user_id = ${context.userId} limit 1
    `;
    return rows[0] ?? null;
  });

/**
 * Overwrite this signed-in user's snapshot with the client's current local
 * state. Called after every meaningful change (debounced client-side) and
 * right after sign-in (to push local guest progress up before it's merged
 * with anything already saved — see `sync.ts`).
 */
export const pushProgress = createServerFn({ method: "POST" })
  .validator((data: SyncedProgress) => data)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const json = JSON.stringify(data);
    // ~4.5MB guard, comfortably under Postgres' own limits — a single
    // student's practice history should never get remotely this large; this
    // just stops a corrupted client payload from writing something absurd.
    if (json.length > 4_500_000) {
      throw new Error("Progress snapshot too large to sync.");
    }
    await sql`
      insert into progress_snapshot (user_id, data, updated_at)
      values (${context.userId}, ${json}::jsonb, current_timestamp)
      on conflict (user_id) do update
        set data = excluded.data, updated_at = excluded.updated_at
    `;
    return { ok: true as const };
  });
