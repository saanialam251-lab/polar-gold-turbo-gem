-- Recovery question for "Forgot password". One row per account.
-- The answer is stored only as a salted scrypt hash (see src/lib/recovery/answer-hash.ts).
-- failed_attempts / locked_until slow down guessing: 5 wrong answers lock resets for 15 minutes.

create table if not exists security_answer (
  user_id text not null primary key references "user" ("id") on delete cascade,
  question_id text not null,
  answer_hash text not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);
