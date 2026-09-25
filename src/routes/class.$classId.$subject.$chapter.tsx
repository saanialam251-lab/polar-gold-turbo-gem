import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getChapter } from "@/lib/syllabus";
import { questionsFor } from "@/lib/questions";
import { chapterStats, MAX_TEST_QUESTIONS, poolFor, selectQuestions } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { MathText } from "@/components/math";
import type { ClassId, Difficulty, Subject, TestMode } from "@/lib/types";

export const Route = createFileRoute("/class/$classId/$subject/$chapter")({
  component: ChapterPage,
});

function ChapterPage() {
  const { classId: raw, subject: subRaw, chapter } = Route.useParams();
  const classId = Number(raw) as ClassId;
  const subject = decodeURIComponent(subRaw) as Subject;
  const ch = getChapter(classId, subject, chapter);
  const states = useAppStore((s) => s.states);
  const tests = useAppStore((s) => s.tests);
  const startTest = useAppStore((s) => s.startTest);
  const restoreQuestions = useAppStore((s) => s.restoreQuestions);
  const navigate = useNavigate();

  const qs = questionsFor(classId, subject, chapter);
  const st = chapterStats(classId, subject, chapter, states);
  const last5 = tests.filter((t) => t.chapterId === chapter).slice(0, 5);

  const [mode, setMode] = useState<TestMode>("practice");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [multiSelect, setMultiSelect] = useState(false);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [msg, setMsg] = useState<string | null>(null);

  const topicId = topicIds.length === 1 ? topicIds[0] : "";

  function toggleTopic(id: string) {
    setMsg(null);
    if (multiSelect) {
      setTopicIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setTopicIds((prev) => (prev.length === 1 && prev[0] === id ? [] : [id]));
    }
  }

  function toggleMultiSelect() {
    setMultiSelect((m) => !m);
    // Switching from multi (0/2+ topics) back to single with an ambiguous
    // selection would be confusing, so clear it and fall back to "mixed".
    setTopicIds((prev) => (prev.length > 1 ? [] : prev));
  }

  const wrongByTopic = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of qs) {
      if ((states[q.id]?.status ?? "NEW") === "WRONG") {
        map.set(q.topicId, (map.get(q.topicId) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [qs, states]);

  // Counts for the mode buttons follow the topic filter, so what the button says
  // is exactly what you get when you press Begin.
  const scoped = topicIds.length > 0 ? qs.filter((q) => topicIds.includes(q.topicId)) : qs;
  const modeCounts = {
    wrong: scoped.filter((q) => (states[q.id]?.status ?? "NEW") === "WRONG").length,
    pyq: scoped.filter((q) => q.isPyq).length,
    mastered: scoped.filter((q) => states[q.id]?.status === "MASTERED").length,
  };
  const masteredList = qs.filter((q) => states[q.id]?.status === "MASTERED");

  // Live "how many can I actually get" for the current mode/difficulty/topic
  // combination — this is the number the Begin button will honour, so the
  // count input's min/max are derived straight from it rather than guessed.
  const effectiveModeForCount: TestMode = topicIds.length > 0 && mode === "practice" ? "topic" : mode;
  const availablePool = poolFor({
    classId,
    subject,
    chapterId: chapter,
    topicIds,
    mode: effectiveModeForCount,
    difficulty,
    states,
  });
  const available = availablePool.length;
  const maxCount = Math.max(1, Math.min(available, MAX_TEST_QUESTIONS));

  useEffect(() => {
    setCount((c) => Math.min(Math.max(c, 1), maxCount));
  }, [maxCount]);

  if (!ch) {
    return (
      <Shell title="Chapter missing">
        <p>This chapter is not in the syllabus.</p>
      </Shell>
    );
  }

  function launch() {
    setMsg(null);
    // A topic filter only relabels plain practice; Wrong / PYQ / Mastered keep their mode
    // (the pool already narrows to the topic through topicIds).
    const effectiveMode: TestMode = topicIds.length > 0 && mode === "practice" ? "topic" : mode;
    const pool = poolFor({
      classId,
      subject,
      chapterId: chapter,
      topicIds,
      mode: effectiveMode,
      difficulty,
      states,
    });
    const wanted = Math.min(count, pool.length, MAX_TEST_QUESTIONS);
    const { selected } = selectQuestions(pool, states, wanted, effectiveMode);
    if (selected.length === 0) {
      setMsg(emptyMessage(effectiveMode, topicIds.length > 0));
      return;
    }
    startTest({
      id: `TEST-${Date.now()}`,
      class: classId,
      subject,
      chapterId: chapter,
      topicId: topicId || undefined,
      mode: effectiveMode,
      difficulty,
      questionIds: selected.map((q) => q.id),
      answers: {},
      locked: {},
      startedAt: Date.now(),
      timePerQuestion: {},
    });
    navigate({ to: "/practice" });
  }

  const emptyBank = qs.length === 0;

  return (
    <Shell
      eyebrow={`Class ${classId} · ${subject}`}
      title={ch.name}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="In bank" value={st.total} />
            <Metric label="Remaining" value={st.remaining} />
            <Metric label="Wrong" value={st.wrong} accent="danger" />
            <Metric label="Mastered" value={st.mastered} accent="sage" />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-xl">Topics</h2>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={multiSelect}
                onChange={toggleMultiSelect}
                className="size-3.5 accent-copper"
              />
              Select multiple topics
            </label>
          </div>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
            <li>
              <button
                type="button"
                onClick={() => {
                  setMsg(null);
                  setTopicIds([]);
                }}
                className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm ${
                  topicIds.length === 0 ? "bg-paper-2" : "bg-paper"
                }`}
              >
                <span className="font-medium">Mixed · any topic</span>
                <span className="text-xs text-muted tabular-nums">{qs.length} q</span>
              </button>
            </li>
            {ch.topics.map((t) => {
              const n = qs.filter((q) => q.topicId === t.id).length;
              const w = qs.filter(
                (q) => q.topicId === t.id && states[q.id]?.status === "WRONG",
              ).length;
              const m = qs.filter(
                (q) => q.topicId === t.id && states[q.id]?.status === "MASTERED",
              ).length;
              const checked = topicIds.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggleTopic(t.id)}
                    className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm ${
                      checked ? "bg-paper-2" : "bg-paper"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {multiSelect ? (
                        <span
                          className={`grid size-4 shrink-0 place-items-center rounded border text-[10px] ${
                            checked ? "border-copper bg-copper text-ink" : "border-line"
                          }`}
                        >
                          {checked ? "✓" : ""}
                        </span>
                      ) : null}
                      <span>
                        <span className="mr-2 text-muted">{String(t.order).padStart(2, "0")}</span>
                        {t.name}
                      </span>
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {n} q{w ? ` · ${w} wrong` : ""}
                      {m ? ` · ${m} mastered` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="rounded-lg border border-line bg-ink p-5 text-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-copper-2">Start a test</p>
          {emptyBank ? (
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              This chapter is mapped, but the question bank is still being filled. Open{" "}
              <strong>Class 11 · Physics · Gravitation</strong> for the full seeded orbit.
            </p>
          ) : (
            <>
              <label className="mt-4 block text-xs text-copper-2">Mode</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["practice", "Practice", null],
                    ["chapter-mixed", "Mixed", null],
                    ["wrong", "Wrong", modeCounts.wrong],
                    ["pyq", "PYQ", modeCounts.pyq],
                    ["mastered", "Mastered", modeCounts.mastered],
                  ] as const
                ).map(([id, label, n]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={`h-9 rounded-full px-3 text-xs ${
                      mode === id ? "bg-copper text-ink" : "bg-ink-soft text-paper"
                    }`}
                  >
                    {label}
                    {n === null ? "" : ` · ${n}`}
                  </button>
                ))}
              </div>
              <label className="mt-4 block text-xs text-copper-2">Difficulty</label>
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
                Questions · {available} available (max {maxCount})
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
              <div className="mt-2 flex gap-2">
                {[5, 10, 20, maxCount]
                  .filter((n, i, arr) => n >= 1 && n <= maxCount && arr.indexOf(n) === i)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`h-8 min-w-10 rounded-full px-2.5 text-xs tabular-nums ${
                        count === n ? "bg-copper text-ink" : "bg-ink-soft text-paper"
                      }`}
                    >
                      {n === maxCount ? `Max (${n})` : n}
                    </button>
                  ))}
              </div>
              {topicIds.length > 0 ? (
                <p className="mt-3 text-xs text-copper-2">
                  {topicIds.length === 1
                    ? "1 topic selected. Tap it again to clear."
                    : `${topicIds.length} topics selected (mixed across them).`}{" "}
                  Tap "Mixed · any topic" to clear.
                </p>
              ) : null}
              <Button variant="copper" className="mt-5 w-full" onClick={launch}>
                Begin
              </Button>
              {msg ? <p className="mt-3 text-sm text-copper-2">{msg}</p> : null}
            </>
          )}
        </aside>
      </div>

      {wrongByTopic.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl">Wrong answers by topic</h2>
          <ul className="mt-3 space-y-2">
            {wrongByTopic.map(([tid, n]) => {
              const name = ch.topics.find((t) => t.id === tid)?.name ?? tid;
              const max = wrongByTopic[0][1];
              return (
                <li key={tid}>
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="tabular-nums text-muted">{n}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-2">
                    <div
                      className="h-full bg-danger"
                      style={{ width: `${Math.round((n / max) * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {masteredList.length > 0 ? (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Mastered questions ({masteredList.length})</h2>
            <button
              type="button"
              onClick={() => restoreQuestions(masteredList.map((q) => q.id))}
              className="text-xs text-copper-2 underline underline-offset-4"
            >
              Restore all
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">
            Answered correctly — hidden from Practice/Mixed so you don't keep
            re-seeing what you already know. Restore one, or all, to bring it
            back into rotation.
          </p>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
            {masteredList.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="line-clamp-2">
                    <MathText text={q.questionText} />
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {ch.topics.find((t) => t.id === q.topicId)?.name ?? q.topicId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => restoreQuestions([q.id])}
                  className="shrink-0 rounded-full bg-ink-soft px-3 py-1.5 text-xs text-paper"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {last5.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-xl">Last tests</h2>
          <div className="mt-3 flex items-end gap-2">
            {last5
              .slice()
              .reverse()
              .map((t) => {
                const pct = t.maxScore ? Math.round((t.score / t.maxScore) * 100) : 0;
                return (
                  <div key={t.id} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-sage"
                      style={{ height: `${Math.max(8, Math.min(96, pct))}px` }}
                    />
                    <span className="text-[10px] tabular-nums text-muted">{t.correct}/{t.questionIds.length}</span>
                  </div>
                );
              })}
          </div>
        </section>
      ) : null}
    </Shell>
  );
}

function emptyMessage(mode: TestMode, hasTopic: boolean): string {
  const where = hasTopic ? "in this topic" : "in this chapter";
  switch (mode) {
    case "mastered":
      return `No mastered questions ${where} yet. A question becomes mastered the moment you answer it correctly — it's then hidden from Practice/Mixed until you restore it.`;
    case "wrong":
      return `No wrong-answer questions ${where} right now. Nice work!`;
    case "pyq":
      return `No previous-year questions ${where} yet.`;
    default:
      return `No eligible questions left ${where}. Try another difficulty or Mixed mode, or revise your Wrong and Mastered questions.`;
  }
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "danger" | "sage";
}) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 font-display text-2xl tabular-nums ${
          accent === "danger" ? "text-danger" : accent === "sage" ? "text-sage" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
                    }
