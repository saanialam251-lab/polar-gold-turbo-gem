import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SYLLABUS } from "@/lib/syllabus";
import { countForChapter } from "@/lib/questions";
import { chapterStats, MAX_TEST_QUESTIONS, selectQuestions, subjectPoolFor } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import type { ClassId, Difficulty, Subject } from "@/lib/types";
import { SUBJECT_WIDE_CHAPTER_ID } from "@/lib/types";

export const Route = createFileRoute("/class/$classId/$subject/")({ component: SubjectPage });

function SubjectPage() {
  const { classId: raw, subject: subRaw } = Route.useParams();
  const classId = Number(raw) as ClassId;
  const subject = decodeURIComponent(subRaw) as Subject;
  const chapters = SYLLABUS[classId]?.[subject];
  const states = useAppStore((s) => s.states);
  const startTest = useAppStore((s) => s.startTest);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [count, setCount] = useState(20);
  const [msg, setMsg] = useState<string | null>(null);

  const pool = subjectPoolFor({ classId, subject, difficulty, states });
  const available = pool.length;
  // Hard ceiling: even if the subject has thousands of questions, a single
  // sitting never offers more than MAX_TEST_QUESTIONS. If the subject has
  // fewer than that, the cap drops to whatever is actually available.
  const maxCount = Math.max(1, Math.min(available, MAX_TEST_QUESTIONS));

  useEffect(() => {
    setCount((c) => Math.min(Math.max(c, 1), maxCount));
  }, [maxCount]);

  function launch() {
    setMsg(null);
    const wanted = Math.min(count, pool.length, MAX_TEST_QUESTIONS);
    const { selected } = selectQuestions(pool, states, wanted, "subject-mixed");
    if (selected.length === 0) {
      setMsg("No eligible questions yet for this subject and difficulty.");
      return;
    }
    startTest({
      id: `TEST-${Date.now()}`,
      class: classId,
      subject,
      chapterId: SUBJECT_WIDE_CHAPTER_ID,
      mode: "subject-mixed",
      difficulty,
      questionIds: selected.map((q) => q.id),
      answers: {},
      locked: {},
      startedAt: Date.now(),
      timePerQuestion: {},
    });
    navigate({ to: "/practice" });
  }

  if (!chapters) {
    return (
      <Shell title="Not found">
        <p>Unknown subject.</p>
      </Shell>
    );
  }

  return (
    <Shell eyebrow={`Class ${classId}`} title={subject}>
      <p className="mb-4 text-sm text-muted">
        Every chapter lists its topics. Open one to practise, retry wrongs, or sit mixed tests.
      </p>

      <div className="mb-6 rounded-lg border border-line bg-ink p-4 text-paper">
        {!open ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-copper-2">
                Whole-subject test
              </p>
              <p className="mt-1 text-sm text-paper/80">
                Pull questions from every chapter of {subject} at once.
              </p>
            </div>
            <Button variant="copper" onClick={() => setOpen(true)}>
              Start
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.16em] text-copper-2">Whole-subject test</p>
            <label className="mt-3 block text-xs text-copper-2">Difficulty</label>
            <div className="mt-2 flex gap-2">
              {(["mixed", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`h-9 rounded-full px-3 text-xs capitalize ${
                    difficulty === d ? "bg-paper text-ink" : "bg-ink-soft text-paper"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs text-copper-2">
              Questions · {available} available across {subject} (max {maxCount})
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={maxCount}
                value={Math.min(count, maxCount)}
                onChange={(e) => setCount(Number(e.target.value))}
                className="h-2 flex-1 accent-copper"
                disabled={maxCount <= 1}
              />
              <input
                type="number"
                min={1}
                max={maxCount}
                value={Math.min(count, maxCount)}
                onChange={(e) =>
                  setCount(Math.min(maxCount, Math.max(1, Number(e.target.value) || 1)))
                }
                className="h-9 w-16 rounded-md border border-line/60 bg-ink-soft px-2 text-center text-sm text-paper tabular-nums"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="copper" onClick={launch}>
                Begin
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
            {msg ? <p className="mt-3 text-sm text-copper-2">{msg}</p> : null}
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {chapters.map((ch) => {
          const n = countForChapter(classId, subject, ch.id);
          const st = n ? chapterStats(classId, subject, ch.id, states) : null;
          return (
            <Link
              key={ch.id}
              to="/class/$classId/$subject/$chapter"
              params={{ classId: String(classId), subject, chapter: ch.id }}
              className="flex flex-col gap-2 rounded-lg border border-line bg-paper px-4 py-4 text-ink no-underline hover:border-copper sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs text-muted">Chapter {String(ch.order).padStart(2, "0")}</p>
                <p className="font-display text-xl tracking-tight">{ch.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {ch.topics.length} topics
                  {n ? ` · ${n} questions` : " · syllabus ready"}
                </p>
              </div>
              {st ? (
                <div className="flex gap-4 text-xs tabular-nums text-muted">
                  <span>{st.attempted} done</span>
                  <span className="text-danger">{st.wrong} wrong</span>
                  <span className="text-sage">{st.mastered} mastered</span>
                </div>
              ) : (
                <span className="text-xs text-muted">Coming next</span>
              )}
            </Link>
          );
        })}
      </div>
    </Shell>
  );
                }
