import { createFileRoute, Link } from "@tanstack/react-router";
import { CLASSES, CLASS_META, SUBJECTS, SYLLABUS } from "@/lib/syllabus";
import { QUESTIONS } from "@/lib/questions";
import { chapterStats, overallStats } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const states = useAppStore((s) => s.states);
  const tests = useAppStore((s) => s.tests);
  const reset = useAppStore((s) => s.resetProgress);
  const stats = overallStats(states, tests);

  const bySubject = SUBJECTS.map((subject) => {
    const qs = QUESTIONS.filter((q) => q.subject === subject);
    let ok = 0;
    let w = 0;
    for (const q of qs) {
      const last = states[q.id]?.attempts.at(-1);
      if (!last) continue;
      if (last.correct) ok += 1;
      else w += 1;
    }
    const den = ok + w;
    return { subject, pct: den ? Math.round((ok / den) * 100) : 0, ok, w };
  });

  return (
    <Shell eyebrow="Analytics" title="Progress">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-muted">
          Name
          <input
            className="ml-2 h-11 rounded-md border border-line bg-paper px-3 text-ink"
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
          />
        </label>
        <label className="text-sm text-muted">
          Default class
          <select
            className="ml-2 h-11 rounded-md border border-line bg-paper px-3"
            value={profile.classId}
            onChange={(e) => setProfile({ classId: Number(e.target.value) as 9 | 10 | 11 | 12 })}
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {CLASS_META[c].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile k="Attempted" v={String(stats.solved)} />
        <Tile k="Last-answer correct" v={String(stats.correct)} />
        <Tile k="Last-answer wrong" v={String(stats.wrong)} />
        <Tile k="Accuracy" v={`${stats.accuracy}%`} />
      </div>

      <h2 className="mt-10 font-display text-xl">By subject</h2>
      <ul className="mt-3 space-y-3">
        {bySubject.map((s) => (
          <li key={s.subject}>
            <div className="flex justify-between text-sm">
              <span>{s.subject}</span>
              <span className="tabular-nums text-muted">
                {s.pct}% · {s.ok} / {s.ok + s.w}
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-paper-2">
              <div className="h-full rounded-full bg-sage" style={{ width: `${s.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl">Recent tests</h2>
      {tests.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No tests yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
          {tests.slice(0, 12).map((t) => {
            const ch = SYLLABUS[t.class][t.subject].find((c) => c.id === t.chapterId);
            return (
              <li key={t.id}>
                <Link
                  to="/result/$testId"
                  params={{ testId: t.id }}
                  className="flex items-center justify-between px-4 py-3 text-ink no-underline hover:bg-paper-2"
                >
                  <span className="text-sm">
                    Class {t.class} · {t.subject} · {ch?.name ?? t.chapterId}
                  </span>
                  <span className="text-sm tabular-nums text-muted">
                    {t.correct}/{t.questionIds.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-10 font-display text-xl">Seeded chapters</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {CLASSES.flatMap((c) =>
          SUBJECTS.flatMap((s) =>
            SYLLABUS[c][s]
              .map((ch) => ({ c, s, ch, n: chapterStats(c, s, ch.id, states) }))
              .filter((x) => x.n.total > 0),
          ),
        ).map(({ c, s, ch, n }) => (
          <li key={`${c}-${s}-${ch.id}`}>
            <Link
              to="/class/$classId/$subject/$chapter"
              params={{ classId: String(c), subject: s, chapter: ch.id }}
              className="text-ink no-underline hover:text-copper"
            >
              Class {c} {s} — {ch.name}{" "}
              <span className="text-muted">
                ({n.total} q · {n.wrong} wrong · {n.mastered} mastered)
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Button variant="outline" className="mt-10" onClick={reset}>
        Reset local progress
      </Button>
    </Shell>
  );
}

function Tile({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{v}</p>
    </div>
  );
}
