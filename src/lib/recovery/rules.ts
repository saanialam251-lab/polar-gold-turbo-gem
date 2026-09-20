/**
 * Sign-up / recovery rules shared by the login page (client) and the server
 * functions. Client-safe: no server imports.
 */

/** Only these email providers may create an account. Add or remove freely. */
export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
] as const;

export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 8;

/** Recovery questions offered at sign-up and on the "Forgot password" screen. */
export const SECURITY_QUESTIONS = [
  { id: "birthday", label: "When was my birthday?" },
  { id: "birthplace", label: "Where was I born?" },
  { id: "residence", label: "Where did I live?" },
  { id: "school", label: "Where did I study?" },
] as const;

export type QuestionId = (typeof SECURITY_QUESTIONS)[number]["id"];

export function isQuestionId(value: unknown): value is QuestionId {
  return SECURITY_QUESTIONS.some((q) => q.id === value);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Human-readable list, e.g. "Gmail, Yahoo, Outlook or Hotmail". */
export function allowedProvidersLabel(): string {
  const names = ALLOWED_EMAIL_DOMAINS.map((d) => {
    const n = d.split(".")[0];
    return n.charAt(0).toUpperCase() + n.slice(1);
  });
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

/** Basic "is this an email at all" check (used when logging in). */
export function emailFormatError(email: string): string | null {
  const v = normalizeEmail(email);
  if (!v) return "Enter your email address.";
  if (!/^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v)) {
    return "That doesn't look like a valid email. Example: yourname@gmail.com";
  }
  return null;
}

/** Full check used when creating an account: valid format AND an allowed provider. */
export function emailError(email: string): string | null {
  const format = emailFormatError(email);
  if (format) return format;
  const domain = normalizeEmail(email).split("@")[1];
  if (!(ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain)) {
    return `Please use a ${allowedProvidersLabel()} email (for example yourname@gmail.com).`;
  }
  return null;
}

export function passwordError(password: string): string | null {
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `Password must be ${PASSWORD_MIN} to ${PASSWORD_MAX} characters.`;
  }
  return null;
}

/** Answers are compared ignoring case and extra spaces. */
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function answerError(answer: string): string | null {
  const n = normalizeAnswer(answer);
  if (n.length < 2) return "Type an answer to your recovery question.";
  if (n.length > 100) return "That answer is too long (100 characters max).";
  return null;
}
