import { Link } from "@tanstack/react-router";
import { Orbit, BarChart3, Home } from "lucide-react";
import type { ReactNode } from "react";

export function Shell({
  children,
  eyebrow,
  title,
  actions,
}: {
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="orbit-grid min-h-dvh text-ink">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 no-underline text-ink">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-paper">
              <Orbit className="size-4" />
            </span>
            <span className="font-display text-lg tracking-tight">Orbit</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm text-ink no-underline hover:bg-paper-2"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/progress"
              className="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm text-ink no-underline hover:bg-paper-2"
            >
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Progress</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {eyebrow ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-copper">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              {title}
            </div>
            {actions}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-line bg-paper px-2.5 text-xs font-medium text-muted">
      {children}
    </span>
  );
}
