import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getChapter } from "@/lib/syllabus";
import { questionsFor } from "@/lib/questions";
import { chapterStats, poolFor, selectQuestions } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();

  const qs = questionsFor(classId, subject, chapter);
  const st = chapterStats(classId, subject, chapter, states);
  const last5 = tests.filter((t) => t.chapterId === chapter).slice(0, 5);

  const [mode, setMode] = useState<TestMode>("practice");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [count, setCount] = useState(10);
  const [topicId, setTopicId] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);

  const wrongByTopic = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of qs) {
      if ((states[q.id]?.status ?? "NEW") === "WRONG") {
        map.set(q.topicId, (map.get(q.topicId) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [qs, states]);

  if (!ch) {
    return (
      <Shell title="Chapter missing">
        <p>This chapter is not in the syllabus.</p>
      </Shell>
    );
  }

  function launch() {
    setMsg(null);
    const pool = poolFor({
      classId,
      subject,
      chapterId: chapter,
      topicId: topicId || undefined,
      mode: topicId ? "topic" : mode,
      difficulty,
      states,
    });
    const { selected, exhausted, remaining } = selectQuestions(pool, states, count, mode);
    if (exhausted || selected.length === 0) {
      setMsg(
        remaining === 0
          ? "No eligible questions left in this pool. Add more, practise wrongs, or review mastered items."
          : "Could not build a test from the current filters.",
      );
      return;
    }
    startTest({
      id: `TEST-${Date.now()}`,
      class: classId,
      subject,
      chapterId: chapter,
      topicId: topicId || undefined,
      mode: topicId ? "topic" : mode,
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

          <h2 className="mt-8 font-display text-xl">Topics</h2>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
            {ch.topics.map((t) => {
              const n = qs.filter((q) => q.topicId === t.id).length;
              const w = states
                ? qs.filter((q) => q.topicId === t.id && states[q.id]?.status === "WRONG").length
                : 0;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setTopicId(topicId === t.id ? "" : t.id)}
                    className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm ${
                      topicId === t.id ? "bg-paper-2" : "bg-paper"
                    }`}
                  >
                    <span>
                      <span className="mr-2 text-muted">{String(t.order).padStart(2, "0")}</span>
                      {t.name}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {n} q{w ? ` · ${w} wrong` : ""}
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
                    ["practice", "Practice"],
                    ["chapter-mixed", "Mixed"],
                    ["wrong", "Wrong"],
                    ["pyq", "PYQ"],
                    ["mastered", "Mastered"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={`h-9 rounded-full px-3 text-xs ${
                      mode === id ? "bg-copper text-ink" : "bg-ink-soft text-paper"
                    }`}
                  >
                    {label}
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
              <label className="mt-4 block text-xs text-copper-2">Questions</label>
              <div className="mt-2 flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCount(n)}
                    className={`h-9 min-w-11 rounded-full px-3 text-xs tabular-nums ${
                      count === n ? "bg-copper text-ink" : "bg-ink-soft text-paper"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {topicId ? (
                <p className="mt-3 text-xs text-copper-2">
                  Topic filter on. Tap the topic again to clear.
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
