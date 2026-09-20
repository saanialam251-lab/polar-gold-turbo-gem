-- One JSON snapshot per signed-in user, holding the same shape the app
-- already keeps in local storage (states / tests / bookmarks / profile). A
-- whole-blob snapshot — rather than normalized rows per question/test — is
-- deliberate: the client already has one atomic object to save and load, and
-- the app is small enough that a single jsonb column is far simpler than a
-- relational rewrite while giving identical semantics.
create table if not exists "progress_snapshot" (
  "user_id" text not null primary key,
  "data" jsonb not null default '{}'::jsonb,
  "updated_at" timestamptz not null default current_timestamp
);
