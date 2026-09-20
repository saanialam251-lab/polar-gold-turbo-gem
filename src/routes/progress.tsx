import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CLASSES, CLASS_META, SUBJECTS, SYLLABUS } from "@/lib/syllabus";
import { QUESTIONS } from "@/lib/questions";
import { chapterStats, classStats, overallStats } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import type { ClassId } from "@/lib/types";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const states = useAppStore((s) => s.states);
  const tests = useAppStore((s) => s.tests);
  const stats = overallStats(states, tests);
  const mastered = Object.values(states).filter((s) => s.status === "MASTERED").length;
  const inWrongPool = Object.values(states).filter((s) => s.status === "WRONG").length;
  const [confirming, setConfirming] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [activeClass, setActiveClass] = useState<ClassId>(profile.classId);

  // Subject breakdown scoped to activeClass only — a Class 9 Physics attempt
  // must never blend into the Class 11 Physics number, and vice versa, so
  // every question is filtered by BOTH class and subject before counting.
  const bySubject = SUBJECTS.map((subject) => {
    const qs = QUESTIONS.filter((q) => q.class === activeClass && q.subject === subject);
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
  const activeClassStats = classStats(activeClass, states, tests);
  const classTests = tests.filter((t) => t.class === activeClass);

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

      <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted">
        All classes combined
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile k="Attempted" v={String(stats.solved)} />
        <Tile k="Last-answer correct" v={String(stats.correct)} />
        <Tile k="Last-answer wrong" v={String(stats.wrong)} />
        <Tile k="Accuracy" v={`${stats.accuracy}%`} />
        <Tile k="Mastered" v={String(mastered)} />
        <Tile k="In wrong pool" v={String(inWrongPool)} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl">Class analytics</h2>
        <div className="flex gap-1.5 rounded-full border border-line bg-paper-2 p-1">
          {CLASSES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveClass(c)}
              className={`h-8 rounded-full px-3 text-xs font-medium tabular-nums ${
                activeClass === c ? "bg-ink text-paper" : "text-ink/70"
              }`}
            >
              Class {c}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        Class {activeClass} only — attempts from other classes are never mixed in here.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile k="Attempted" v={String(activeClassStats.solved)} />
        <Tile k="Accuracy" v={`${activeClassStats.accuracy}%`} />
        <Tile k="Tests logged" v={String(activeClassStats.tests)} />
        <Tile k="Correct" v={String(activeClassStats.correct)} />
        <Tile k="Mastered" v={String(activeClassStats.mastered)} />
        <Tile k="In wrong pool" v={String(activeClassStats.inWrongPool)} />
      </div>

      <h3 className="mt-6 font-display text-lg">By subject · Class {activeClass}</h3>
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

      <h3 className="mt-8 font-display text-lg">Recent tests · Class {activeClass}</h3>
      {classTests.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No tests yet for Class {activeClass}.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
          {classTests.slice(0, 12).map((t) => {
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

      <div className="mt-10">
        {confirming ? (
          <ResetPanel
            activeClass={activeClass}
            onCancel={() => setConfirming(false)}
            onDone={() => {
              setConfirming(false);
              setResetDone(true);
            }}
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setResetDone(false);
              setConfirming(true);
            }}
          >
            Reset progress…
          </Button>
        )}
        {resetDone ? (
          <p role="status" className="mt-3 text-sm text-sage">
            Done. The counts above reflect it immediately.
          </p>
        ) : null}
      </div>
    </Shell>
  );
}

function ResetPanel({
  activeClass,
  onCancel,
  onDone,
}: {
  activeClass: ClassId;
  onCancel: () => void;
  onDone: () => void;
}) {
  const reset = useAppStore((s) => s.resetProgress);
  const [scope, setScope] = useState<"all" | "class">("class");
  const [clearStates, setClearStates] = useState(true);
  const [clearTests, setClearTests] = useState(true);
  const [clearBookmarks, setClearBookmarks] = useState(false);

  const nothingPicked = !clearStates && !clearTests && !clearBookmarks;

  return (
    <div className="rounded-lg border border-danger/40 bg-paper p-4">
      <p className="text-sm font-medium">What do you want to clear?</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setScope("class")}
          className={`h-9 rounded-full px-3 text-xs ${
            scope === "class" ? "bg-ink text-paper" : "bg-paper-2 text-ink"
          }`}
        >
          Class {activeClass} only
        </button>
        <button
          type="button"
          onClick={() => setScope("all")}
          className={`h-9 rounded-full px-3 text-xs ${
            scope === "all" ? "bg-ink text-paper" : "bg-paper-2 text-ink"
          }`}
        >
          All classes
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={clearStates}
            onChange={(e) => setClearStates(e.target.checked)}
            className="size-4 accent-copper"
          />
          Question progress — mastered / wrong / correct pools
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={clearTests}
            onChange={(e) => setClearTests(e.target.checked)}
            className="size-4 accent-copper"
          />
          Test history — every completed test record
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={clearBookmarks}
            onChange={(e) => setClearBookmarks(e.target.checked)}
            className="size-4 accent-copper"
          />
          Bookmarks
        </label>
      </div>

      <p className="mt-3 text-xs text-muted">
        Your name, default class, and account login are never touched by this.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="danger"
          disabled={nothingPicked}
          onClick={() => {
            reset({
              classId: scope === "class" ? activeClass : undefined,
              states: clearStates,
              tests: clearTests,
              bookmarks: clearBookmarks,
            });
            onDone();
          }}
        >
          Clear selected
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
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
