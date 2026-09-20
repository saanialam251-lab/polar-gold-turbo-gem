/**
 * On-device accounts for the Android app (Capacitor).
 *
 * The APK is a static bundle inside a WebView: there is no server, no /api/auth
 * and no database in it. So inside the app, accounts live in the phone's own
 * storage. Passwords and recovery answers are stored only as salted PBKDF2
 * hashes. Accounts do NOT sync between phones. The website keeps using the real
 * server login (see login.tsx).
 *
 * No React in this file so it can be unit-tested.
 */
import {
  answerError,
  emailError,
  emailFormatError,
  isQuestionId,
  normalizeAnswer,
  normalizeEmail,
  passwordError,
} from "../recovery/rules.ts";

const ACCOUNTS_KEY = "orbit.local.accounts";
const SESSION_KEY = "orbit.local.session";
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;
const ITERATIONS = 50_000;

export type Result = { ok: true } | { ok: false; message: string };

type Account = {
  name: string;
  email: string;
  salt: string;
  pw: string;
  questionId: string;
  ans: string;
  failed: number;
  lockedUntil: number;
};

/** True inside the Android app (Capacitor injects `window.Capacitor`). */
export function isLocalAuth(): boolean {
  const cap = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  try {
    return Boolean(cap?.isNativePlatform?.());
  } catch {
    return false;
  }
}

// ── storage ──────────────────────────────────────────────────────────────────
function readAccounts(): Record<string, Account> {
  try {
    const raw = globalThis.localStorage?.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Account>) : {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, Account>): void {
  globalThis.localStorage?.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

const listeners = new Set<() => void>();
function notify(): void {
  listeners.forEach((l) => l());
}

export function subscribeSession(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function readSessionEmail(): string | null {
  try {
    return globalThis.localStorage?.getItem(SESSION_KEY) ?? null;
  } catch {
    return null;
  }
}

export function getLocalAccount(email: string): { name: string; email: string } | null {
  const a = readAccounts()[normalizeEmail(email)];
  return a ? { name: a.name, email: a.email } : null;
}

export function localEmailExists(email: string): boolean {
  return Boolean(readAccounts()[normalizeEmail(email)]);
}

// ── hashing (Web Crypto is available in the app's secure WebView) ───────────
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function derive(value: string, saltHex: string): Promise<string> {
  const subtle = globalThis.crypto.subtle;
  const key = await subtle.importKey("raw", new TextEncoder().encode(value), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await subtle.deriveBits(
    { name: "PBKDF2", salt: fromHex(saltHex) as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

function newSalt(): string {
  return toHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}

// ── actions ──────────────────────────────────────────────────────────────────
export async function localSignUp(input: {
  name: string;
  email: string;
  password: string;
  questionId: string;
  answer: string;
}): Promise<Result> {
  const email = normalizeEmail(input.email);
  if (!input.name.trim()) return { ok: false, message: "Enter your name." };
  const problem =
    emailError(email) ??
    passwordError(input.password) ??
    (isQuestionId(input.questionId) ? null : "Choose a recovery question.") ??
    answerError(input.answer);
  if (problem) return { ok: false, message: problem };

  const accounts = readAccounts();
  if (accounts[email]) return { ok: false, message: "This email already has an account. Log in instead." };

  const salt = newSalt();
  accounts[email] = {
    name: input.name.trim(),
    email,
    salt,
    pw: await derive(input.password, salt),
    questionId: input.questionId,
    ans: await derive(normalizeAnswer(input.answer), salt),
    failed: 0,
    lockedUntil: 0,
  };
  writeAccounts(accounts);
  return { ok: true };
}

export async function localSignIn(
  rawEmail: string,
  password: string,
): Promise<
  { ok: true; name: string } | { ok: false; reason: "no-account" | "wrong-password" }
> {
  const email = normalizeEmail(rawEmail);
  const account = readAccounts()[email];
  if (!account) return { ok: false, reason: "no-account" };
  if ((await derive(password, account.salt)) !== account.pw) {
    return { ok: false, reason: "wrong-password" };
  }
  globalThis.localStorage?.setItem(SESSION_KEY, email);
  notify();
  return { ok: true, name: account.name };
}

export function localSignOut(): void {
  globalThis.localStorage?.removeItem(SESSION_KEY);
  notify();
}

export async function localResetPassword(input: {
  email: string;
  questionId: string;
  answer: string;
  newPassword: string;
}): Promise<Result> {
  const email = normalizeEmail(input.email);
  const problem =
    emailFormatError(email) ??
    (isQuestionId(input.questionId) ? null : "Choose your recovery question.") ??
    answerError(input.answer) ??
    passwordError(input.newPassword);
  if (problem) return { ok: false, message: problem };

  const accounts = readAccounts();
  const account = accounts[email];
  if (!account) {
    return { ok: false, message: "No account found with this email. Please create an account first." };
  }
  const locked = "Too many wrong answers. Please wait 15 minutes and try again.";
  if (account.lockedUntil > Date.now()) return { ok: false, message: locked };

  const matches =
    account.questionId === input.questionId &&
    (await derive(normalizeAnswer(input.answer), account.salt)) === account.ans;

  if (!matches) {
    account.failed += 1;
    if (account.failed >= MAX_FAILED) {
      account.failed = 0;
      account.lockedUntil = Date.now() + LOCK_MS;
      writeAccounts(accounts);
      return { ok: false, message: locked };
    }
    writeAccounts(accounts);
    return {
      ok: false,
      message: "That answer doesn't match. Check the question you picked and try again.",
    };
  }

  account.pw = await derive(input.newPassword, account.salt);
  account.failed = 0;
  account.lockedUntil = 0;
  writeAccounts(accounts);
  if (readSessionEmail() === email) localSignOut();
  return { ok: true };
    }
