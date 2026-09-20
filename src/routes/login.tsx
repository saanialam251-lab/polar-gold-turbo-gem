import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/client";
import { useAppUser } from "@/lib/app-user";
import {
  isLocalAuth,
  localEmailExists,
  localResetPassword,
  localSignIn,
  localSignUp,
} from "@/lib/local-auth/local-auth";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  SECURITY_QUESTIONS,
  allowedProvidersLabel,
  answerError,
  emailError,
  emailFormatError,
  normalizeEmail,
  passwordError,
} from "@/lib/recovery/rules";
import {
  checkEmailExists,
  resetPasswordWithAnswer,
  saveSecurityAnswer,
} from "@/lib/recovery/server-fn";
import { useAppStore } from "@/lib/store";

type Notice = "created" | "recovery-failed" | "reset";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { notice?: Notice } => {
    const n = search.notice;
    return n === "created" || n === "recovery-failed" || n === "reset" ? { notice: n } : {};
  },
});

type Mode = "signin" | "signup" | "forgot";

const NOTICE_TEXT: Record<Notice, string> = {
  created: "Account created! Now log in with your email and password.",
  "recovery-failed":
    "Account created, but your recovery question could not be saved. You can still log in.",
  reset: "Password changed. Log in with your new password.",
};

const BEARER_KEY = "grok-auth.bearer-token";

/**
 * In the embedded live preview the browser refuses the session cookie, so the app
 * authenticates with a bearer token instead. Better Auth returns it in the
 * `set-auth-token` header of every sign-in / sign-up response — keep it, or the
 * page looks "logged out" straight after a successful login.
 */
function keepSessionToken(ctx: { response: Response }) {
  const token = ctx.response.headers.get("set-auth-token");
  if (!token) return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* storage unavailable — cookie login still works */
  }
}

const inputClass =
  "h-11 w-full rounded-md border border-line bg-paper px-3 text-sm disabled:opacity-60";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        maxLength={PASSWORD_MAX}
        onChange={(e) => onChange(e.target.value.slice(0, PASSWORD_MAX))}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted hover:text-ink"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function QuestionSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={inputClass}
    >
      <option value="">Choose a question…</option>
      {SECURITY_QUESTIONS.map((q) => (
        <option key={q.id} value={q.id}>
          {q.label}
        </option>
      ))}
    </select>
  );
}

function LoginPage() {
  const { notice } = Route.useSearch();
  const { user, isPending } = useAppUser();
  const navigate = useNavigate();
  const setProfile = useAppStore((s) => s.setProfile);

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(notice ? NOTICE_TEXT[notice] : null);
  // While sign-up is finishing (saving the recovery answer, then logging out) the
  // new account is briefly "signed in" — don't bounce to the home page yet.
  const [finishing, setFinishing] = useState(false);

  if (!isPending && user && !finishing) {
    return <Navigate to="/" />;
  }

  function switchMode(next: Mode, opts: { keepInfo?: boolean } = {}) {
    setMode(next);
    setError(null);
    if (!opts.keepInfo) setInfo(null);
    setPassword("");
    setConfirm("");
    setAnswer("");
    setQuestionId("");
  }

  async function signUp() {
    const e = normalizeEmail(email);
    if (!name.trim()) return setError("Enter your name.");
    const emailProblem = emailError(e);
    if (emailProblem) return setError(emailProblem);
    const pwProblem = passwordError(password);
    if (pwProblem) return setError(pwProblem);
    if (confirm !== password) return setError("The two passwords don't match.");
    if (!questionId) return setError("Choose a recovery question.");
    const ansProblem = answerError(answer);
    if (ansProblem) return setError(ansProblem);

    setBusy(true);
    setFinishing(true);
    try {
      if (isLocalAuth()) {
        const made = await localSignUp({ name, email: e, password, questionId, answer });
        setFinishing(false);
        if (!made.ok) {
          if (localEmailExists(e)) {
            switchMode("signin");
            setEmail(e);
            setInfo("This email already has an account. Log in instead.");
          } else {
            setError(made.message);
          }
          return;
        }
        setProfile({ name: name.trim() });
        switchMode("signin");
        setEmail(e);
        setInfo(NOTICE_TEXT.created);
        return;
      }
      const { exists } = await checkEmailExists({ data: { email: e } });
      if (exists) {
        setFinishing(false);
        switchMode("signin");
        setEmail(e);
        setInfo("This email already has an account. Log in instead.");
        return;
      }

      const { error: err } = await authClient.signUp.email(
        { email: e, password, name: name.trim() },
        { onSuccess: keepSessionToken },
      );
      if (err) throw new Error(err.message ?? "Could not create the account.");
      setProfile({ name: name.trim() });

      // Save the recovery question while the new account is still signed in.
      let outcome: Notice = "created";
      try {
        const saved = await saveSecurityAnswer({ data: { questionId, answer } });
        if (!saved.ok) outcome = "recovery-failed";
      } catch {
        outcome = "recovery-failed";
      }

      // Creating an account does NOT log you in: go to the login page.
      await signOut(`/login?notice=${outcome}`);
    } catch (err) {
      setFinishing(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signIn() {
    const e = normalizeEmail(email);
    const emailProblem = emailFormatError(e);
    if (emailProblem) return setError(emailProblem);
    if (!password) return setError("Enter your password.");

    setBusy(true);
    try {
      if (isLocalAuth()) {
        const res = await localSignIn(e, password);
        if (res.ok) {
          setProfile({ name: res.name });
          void navigate({ to: "/" });
        } else if (res.reason === "no-account") {
          switchMode("signup");
          setEmail(e);
          setInfo("We couldn't find an account with that email. Create an account first.");
        } else {
          setError("Wrong password. Try again, or tap “Forgot password?” to reset it.");
        }
        return;
      }
      const { exists } = await checkEmailExists({ data: { email: e } });
      if (!exists) {
        switchMode("signup");
        setEmail(e);
        setInfo("We couldn't find an account with that email. Create an account first.");
        return;
      }
      const { data, error: err } = await authClient.signIn.email(
        { email: e, password },
        { onSuccess: keepSessionToken },
      );
      if (err) {
        if (err.status === 401 || err.code === "INVALID_EMAIL_OR_PASSWORD") {
          throw new Error(
            "Wrong password. Try again, or tap “Forgot password?” to reset it.",
          );
        }
        throw new Error(err.message ?? "Could not log in.");
      }
      if (data?.user?.name) setProfile({ name: data.user.name });
      // Full page load: the home page starts fresh with the new session.
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    const e = normalizeEmail(email);
    const emailProblem = emailFormatError(e);
    if (emailProblem) return setError(emailProblem);
    if (!questionId) return setError("Choose your recovery question.");
    const ansProblem = answerError(answer);
    if (ansProblem) return setError(ansProblem);
    const pwProblem = passwordError(password);
    if (pwProblem) return setError(pwProblem);
    if (confirm !== password) return setError("The two passwords don't match.");

    setBusy(true);
    try {
      if (isLocalAuth()) {
        if (!localEmailExists(e)) {
          switchMode("signup");
          setEmail(e);
          setInfo("We couldn't find an account with that email. Create an account first.");
          return;
        }
        const done = await localResetPassword({
          email: e,
          questionId,
          answer,
          newPassword: password,
        });
        if (!done.ok) {
          setError(done.message);
          return;
        }
        switchMode("signin");
        setEmail(e);
        setInfo(NOTICE_TEXT.reset);
        return;
      }
      const { exists } = await checkEmailExists({ data: { email: e } });
      if (!exists) {
        switchMode("signup");
        setEmail(e);
        setInfo("We couldn't find an account with that email. Create an account first.");
        return;
      }
      const result = await resetPasswordWithAnswer({
        data: { email: e, questionId, answer, newPassword: password },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      try {
        window.sessionStorage.removeItem(BEARER_KEY);
      } catch {
        /* ignore */
      }
      switchMode("signin");
      setEmail(e);
      setInfo(NOTICE_TEXT.reset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === "signup") void signUp();
    else if (mode === "forgot") void resetPassword();
    else void signIn();
  }

  const title =
    mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Log in";
  const submitLabel =
    mode === "signup" ? "Create account" : mode === "forgot" ? "Change password" : "Log in";
  const passwordLabel = mode === "forgot" ? "New password" : "Password";

  return (
    <Shell eyebrow="Account" title={title}>
      <p className="max-w-md text-sm text-muted">
        {mode === "signup"
          ? `Use a ${allowedProvidersLabel()} email, a ${PASSWORD_MIN}–${PASSWORD_MAX} character password, and a recovery question in case you forget the password.`
          : mode === "forgot"
            ? "Pick the recovery question you chose when you created the account and answer it. If it matches, you can set a new password."
            : "Log in to keep your progress on any phone."}
      </p>

      <form onSubmit={submit} noValidate className="mt-6 flex max-w-sm flex-col gap-3">
        {mode === "signup" ? (
          <Field label="Your name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoComplete="name"
              disabled={busy}
            />
          </Field>
        ) : null}

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            className={inputClass}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            disabled={busy}
          />
        </Field>

        {mode === "forgot" ? (
          <>
            <Field label="Your recovery question">
              <QuestionSelect value={questionId} onChange={setQuestionId} disabled={busy} />
            </Field>
            <Field label="Your answer" hint="Capital letters don't matter.">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={inputClass}
                autoComplete="off"
                disabled={busy}
              />
            </Field>
          </>
        ) : null}

        <Field
          label={passwordLabel}
          hint={mode !== "signin" ? `${PASSWORD_MIN}–${PASSWORD_MAX} characters.` : undefined}
        >
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            disabled={busy}
          />
        </Field>

        {mode !== "signin" ? (
          <Field label={mode === "forgot" ? "Confirm new password" : "Confirm password"}>
            <PasswordInput
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              disabled={busy}
            />
          </Field>
        ) : null}

        {mode === "signup" ? (
          <>
            <Field label="Recovery question">
              <QuestionSelect value={questionId} onChange={setQuestionId} disabled={busy} />
            </Field>
            <Field
              label="Your answer"
              hint="You'll need this answer if you forget your password. Capital letters don't matter."
            >
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={inputClass}
                autoComplete="off"
                disabled={busy}
              />
            </Field>
          </>
        ) : null}

        {info ? (
          <p role="status" className="rounded-md bg-paper-2 px-3 py-2 text-sm text-ink">
            {info}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="copper" disabled={busy} className="mt-2">
          {busy ? "Please wait…" : submitLabel}
        </Button>
      </form>

      <div className="mt-4 flex max-w-sm flex-col items-start gap-2 text-sm">
        {mode === "signin" ? (
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="text-copper-2 underline underline-offset-4"
          >
            Forgot password?
          </button>
        ) : null}
        {mode === "signup" ? (
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="text-copper-2 underline underline-offset-4"
          >
            Already have an account? Log in
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode(mode === "forgot" ? "signin" : "signup")}
            className="text-copper-2 underline underline-offset-4"
          >
            {mode === "forgot" ? "Back to log in" : "New here? Create an account"}
          </button>
        )}
      </div>
    </Shell>
  );
      }
