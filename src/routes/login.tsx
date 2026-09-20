import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: LoginPage });

const PIN_MIN = 6;
const PIN_MAX = 8;

function pinError(pin: string): string | null {
  if (!/^\d+$/.test(pin)) return "PIN must be numbers only.";
  if (pin.length < PIN_MIN || pin.length > PIN_MAX) {
    return `PIN must be ${PIN_MIN}–${PIN_MAX} digits.`;
  }
  return null;
}

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const setProfile = useAppStore((s) => s.setProfile);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPending && user) {
    return <Navigate to="/" />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const pe = pinError(pin);
    if (pe) return setError(pe);
    if (!email.trim()) return setError("Enter an email address.");
    if (mode === "signup" && !name.trim()) return setError("Enter your name.");

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password: pin,
          name: name.trim(),
        });
        if (err) throw new Error(err.message ?? "Could not create account.");
        setProfile({ name: name.trim() });
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password: pin,
        });
        if (err) throw new Error(err.message ?? "Wrong email or PIN.");
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell eyebrow="Account" title={mode === "signup" ? "Create your account" : "Log in"}>
      <p className="max-w-md text-sm text-muted">
        One login per student, works on any phone — your progress follows you.
        No OTP, nothing to verify: just an email and a {PIN_MIN}–{PIN_MAX} digit
        PIN you'll remember. Stay logged in — you won't be asked again on this
        device.
      </p>

      <form onSubmit={submit} className="mt-6 flex max-w-sm flex-col gap-3">
        {mode === "signup" ? (
          <label className="text-sm">
            <span className="mb-1 block text-xs text-muted">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
              autoComplete="name"
            />
          </label>
        ) : null}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
            autoComplete="email"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-muted">
            {PIN_MIN}–{PIN_MAX} digit PIN
          </span>
          <input
            type="password"
            inputMode="numeric"
            pattern="\d*"
            maxLength={PIN_MAX}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_MAX))}
            className="h-11 w-full rounded-md border border-line bg-paper px-3 text-sm tracking-[0.3em]"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" variant="copper" disabled={busy} className="mt-2">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "signup" ? "signin" : "signup"));
          setError(null);
        }}
        className="mt-4 text-sm text-copper-2 underline underline-offset-4"
      >
        {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
      </button>
    </Shell>
  );
            }
