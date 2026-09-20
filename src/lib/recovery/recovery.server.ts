import { hashPassword } from "better-auth/crypto";
import { getSql } from "@/lib/db";
import { hashAnswer, verifyAnswer } from "./answer-hash";
import {
  answerError,
  emailFormatError,
  isQuestionId,
  normalizeEmail,
  passwordError,
} from "./rules";

/** Server-only. Called from `server-fn.ts` via dynamic import. */

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export type Result = { ok: true } | { ok: false; message: string };

export async function emailExists(rawEmail: string): Promise<boolean> {
  if (emailFormatError(rawEmail)) return false;
  const sql = await getSql();
  const rows = await sql`
    select 1 as found from "user" where lower("email") = ${normalizeEmail(rawEmail)} limit 1
  `;
  return rows.length > 0;
}

/** Save (or replace) the signed-in user's recovery question + hashed answer. */
export async function saveAnswer(
  userId: string,
  questionId: unknown,
  answer: unknown,
): Promise<Result> {
  if (!isQuestionId(questionId)) return { ok: false, message: "Choose a recovery question." };
  if (typeof answer !== "string") return { ok: false, message: "Type an answer." };
  const bad = answerError(answer);
  if (bad) return { ok: false, message: bad };

  const hash = await hashAnswer(answer);
  const sql = await getSql();
  await sql`
    insert into security_answer (user_id, question_id, answer_hash)
    values (${userId}, ${questionId}, ${hash})
    on conflict (user_id) do update
      set question_id = excluded.question_id,
          answer_hash = excluded.answer_hash,
          failed_attempts = 0,
          locked_until = null,
          updated_at = current_timestamp
  `;
  return { ok: true };
}

type ResetRow = {
  id: string;
  question_id: string | null;
  answer_hash: string | null;
  failed_attempts: number | null;
  locked_until: string | Date | null;
};

const WRONG = "That answer doesn't match. Check the question you picked and try again.";

export async function resetPassword(input: {
  email: unknown;
  questionId: unknown;
  answer: unknown;
  newPassword: unknown;
}): Promise<Result> {
  const { email, questionId, answer, newPassword } = input;
  if (typeof email !== "string" || typeof answer !== "string" || typeof newPassword !== "string") {
    return { ok: false, message: "Something is missing. Fill in every box." };
  }
  const emailProblem = emailFormatError(email);
  if (emailProblem) return { ok: false, message: emailProblem };
  if (!isQuestionId(questionId)) return { ok: false, message: "Choose your recovery question." };
  const answerProblem = answerError(answer);
  if (answerProblem) return { ok: false, message: answerProblem };
  const passwordProblem = passwordError(newPassword);
  if (passwordProblem) return { ok: false, message: passwordProblem };

  const sql = await getSql();
  const rows = await sql<ResetRow>`
    select u."id" as id, s.question_id, s.answer_hash, s.failed_attempts, s.locked_until
    from "user" u
    left join security_answer s on s.user_id = u."id"
    where lower(u."email") = ${normalizeEmail(email)}
    limit 1
  `;
  const row = rows[0];
  if (!row) {
    return { ok: false, message: "No account found with this email. Please create an account first." };
  }
  if (!row.answer_hash || !row.question_id) {
    return {
      ok: false,
      message: "This account has no recovery question saved, so the password can't be reset here.",
    };
  }
  if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
    return {
      ok: false,
      message: `Too many wrong answers. Please wait ${LOCK_MINUTES} minutes and try again.`,
    };
  }

  const matches =
    row.question_id === questionId && (await verifyAnswer(answer, row.answer_hash));

  if (!matches) {
    const updated = await sql<{ locked: boolean }>`
      update security_answer
      set failed_attempts = case when failed_attempts + 1 >= ${MAX_FAILED_ATTEMPTS}::int then 0 else failed_attempts + 1 end,
          locked_until = case when failed_attempts + 1 >= ${MAX_FAILED_ATTEMPTS}::int
                              then current_timestamp + make_interval(mins => ${LOCK_MINUTES}::int)
                              else null end,
          updated_at = current_timestamp
      where user_id = ${row.id}
      returning (locked_until is not null) as locked
    `;
    if (updated[0]?.locked) {
      return {
        ok: false,
        message: `Too many wrong answers. Please wait ${LOCK_MINUTES} minutes and try again.`,
      };
    }
    return { ok: false, message: WRONG };
  }

  const hash = await hashPassword(newPassword);
  const changed = await sql`
    update "account"
    set "password" = ${hash}, "updatedAt" = current_timestamp
    where "userId" = ${row.id} and "providerId" = 'credential'
    returning "id"
  `;
  if (changed.length === 0) {
    return {
      ok: false,
      message: "This account signs in with Google or X, so it has no password to reset.",
    };
  }
  // Anyone signed in with the old password is signed out.
  await sql`delete from "session" where "userId" = ${row.id}`;
  await sql`
    update security_answer
    set failed_attempts = 0, locked_until = null, updated_at = current_timestamp
    where user_id = ${row.id}
  `;
  return { ok: true };
}
