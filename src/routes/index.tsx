import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FlaskConical, Sigma } from "lucide-react";
import { CLASSES, CLASS_META, SUBJECTS, SYLLABUS } from "@/lib/syllabus";
import { QUESTIONS } from "@/lib/questions";
import { overallStats } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import type { Subject } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

const ICONS: Record<Subject, typeof BookOpen> = {
  Physics: BookOpen,
  Chemistry: FlaskConical,
  Mathematics: Sigma,
};

function Home() {
  const profile = useAppStore((s) => s.profile);
  const states = useAppStore((s) => s.states);
  const tests = useAppStore((s) => s.tests);
  const stats = overallStats(states, tests);
  const seeded = QUESTIONS.length;

  return (
    <Shell>
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
            CBSE practice · Classes 9–12
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Master every orbit of the syllabus.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Questions never randomly recycle. New ones come first, wrong ones wait in a
            dedicated pool, and mastered items stay out of ordinary tests until you call
            them back.
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-ink p-5 text-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-copper-2">Your desk</p>
          <p className="mt-2 font-display text-2xl">{profile.name}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat k="Questions in bank" v={String(seeded)} />
            <Stat k="Attempted" v={String(stats.solved)} />
            <Stat k="Accuracy" v={`${stats.accuracy}%`} />
            <Stat k="Tests logged" v={String(stats.tests)} />
          </dl>
        </aside>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Choose a class</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CLASSES.map((c) => {
            const meta = CLASS_META[c];
            const nCh = SUBJECTS.reduce((n, s) => n + SYLLABUS[c][s].length, 0);
            return (
              <Link
                key={c}
                to="/class/$classId"
                params={{ classId: String(c) }}
                className="group rounded-lg border border-line bg-paper p-5 no-underline text-ink transition-colors hover:border-copper"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl">{meta.label}</span>
                  <span className="text-xs text-muted">{meta.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{meta.note}</p>
                <p className="mt-3 text-xs text-copper">
                  {nCh} chapters · Physics, Chemistry, Mathematics
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">How tests are built</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["New first", "Untouched questions are always the highest priority."],
            ["Wrong pool", "Misses wait in a chapter tab until you retry them."],
            ["Mastery", "Two consecutive correct answers retire a question from ordinary tests."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-lg border border-line bg-paper-2/50 p-4">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 mb-4">
        <h2 className="font-display text-2xl tracking-tight">Subjects</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {SUBJECTS.map((s) => {
            const Icon = ICONS[s];
            return (
              <div
                key={s}
                className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm"
              >
                <Icon className="size-4 text-copper" />
                {s}
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-copper-2">{k}</dt>
      <dd className="font-display text-xl tabular-nums">{v}</dd>
    </div>
  );
}
