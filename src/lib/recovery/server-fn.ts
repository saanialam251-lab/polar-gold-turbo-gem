import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Result } from "./recovery.server";

/**
 * Server functions for "create account with a recovery question" and
 * "forgot password". All logic lives in `recovery.server.ts` (dynamic import so
 * it never reaches the browser bundle).
 */

/** Does an account with this email exist? (Lets the login page say "create an account first".) */
export const checkEmailExists = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }): Promise<{ exists: boolean }> => {
    const { emailExists } = await import("./recovery.server");
    return { exists: await emailExists(data.email) };
  });

/** Save the signed-in user's recovery question + answer (called right after sign-up). */
export const saveSecurityAnswer = createServerFn({ method: "POST" })
  .validator((data: { questionId: string; answer: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<Result> => {
    const { saveAnswer } = await import("./recovery.server");
    return saveAnswer(context.userId, data.questionId, data.answer);
  });

/** Forgot password: verify the recovery answer and set a new password. */
export const resetPasswordWithAnswer = createServerFn({ method: "POST" })
  .validator(
    (data: { email: string; questionId: string; answer: string; newPassword: string }) => data,
  )
  .handler(async ({ data }): Promise<Result> => {
    const { resetPassword } = await import("./recovery.server");
    return resetPassword(data);
  });
