import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { questionById } from "@/lib/questions";
import { getChapter } from "@/lib/syllabus";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { MathTex, MathText } from "@/components/math";
import { Shell } from "@/components/shell";
import type { OptionId } from "@/lib/types";

export const Route = createFileRoute("/practice")({ component: PracticePage });

function PracticePage() {
  const active = useAppStore((s) => s.active);
  const lockAnswer = useAppStore((s) => s.lockAnswer);
  const finishTest = useAppStore((s) => s.finishTest);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<OptionId | null>(null);
  const [started, setStarted] = useState(Date.now());

  useEffect(() => {
    setPicked(null);
    setStarted(Date.now());
  }, [idx]);

  const q = useMemo(
    () => (active ? questionById(active.questionIds[idx]) : undefined),
    [active, idx],
  );

  if (!active) {
    return (
      <Shell title="No active test">
        <p className="text-muted">Start a test from any chapter dashboard.</p>
      </Shell>
    );
  }

  const chapter = getChapter(active.class, active.subject, active.chapterId);
  const locked = q ? Boolean(active.locked[q.id]) : false;
  const saved = q ? active.answers[q.id] : null;
  const total = active.questionIds.length;
  const done = Object.keys(active.locked).length;

  function onLock() {
    if (!q || locked) return;
    lockAnswer(q.id, picked, Math.round((Date.now() - started) / 1000));
  }

  function onFinish() {
    const completed = finishTest();
    if (completed) navigate({ to: "/result/$testId", params: { testId: completed.id } });
  }

  return (
    <Shell
      eyebrow={`${active.subject} · Class ${active.class}`}
      title={
        <span className="flex flex-col">
          <span>{chapter?.name ?? "Practice"}</span>
          <span className="mt-1 font-sans text-sm font-medium text-muted">
            Question {idx + 1} of {total} · {done} locked
          </span>
        </span>
      }
      actions={
        <Button variant="outline" size="sm" onClick={onFinish}>
          Submit test
        </Button>
      }
    >
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-paper-2">
        <div
          className="h-full bg-copper transition-[width] duration-300"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>

      {q ? (
        <article className="rounded-lg border border-line bg-paper p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-muted">
              <span className="rounded-full border border-line px-2 py-0.5">{q.difficulty}</span>
              {q.isPyq ? (
                <span className="rounded-full border border-copper px-2 py-0.5 text-copper">
                  PYQ {q.pyqYear}
                </span>
              ) : null}
              <span className="rounded-full border border-line px-2 py-0.5">+4 / −1</span>
            </div>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-md hover:bg-paper-2"
              onClick={() => toggleBookmark(q.id)}
              aria-label="Bookmark"
            >
              <Bookmark
                className={`size-4 ${bookmarks.includes(q.id) ? "fill-copper text-copper" : "text-muted"}`}
              />
            </button>
          </div>

          <h2 className="mt-4 font-display text-2xl leading-snug tracking-tight">
            <MathText text={q.questionText} />
          </h2>
          {q.latex ? (
            <div className="mt-3 overflow-x-auto rounded-md border border-line bg-paper-2 px-4 py-3">
              <MathTex tex={q.latex} display />
            </div>
          ) : null}

          <div className="mt-6 grid gap-2">
            {q.options.map((opt) => {
              const selected = (locked ? saved : picked) === opt.id;
              const isCorrect = locked && opt.id === q.correct;
              const isWrong = locked && selected && opt.id !== q.correct;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setPicked(opt.id)}
                  className={`flex min-h-12 items-start gap-3 rounded-md border px-3 py-3 text-left ${
                    isCorrect
                      ? "border-sage bg-sage/10"
                      : isWrong
                        ? "border-danger bg-danger/10"
                        : selected
                          ? "border-ink bg-paper-2"
                          : "border-line bg-paper hover:border-copper"
                  }`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-xs font-medium">
                    {opt.id}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed">
                    <MathText text={opt.text} />
                    {opt.latex ? <MathTex tex={opt.latex} className="mt-1" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {!locked ? (
              <Button onClick={onLock} disabled={!picked}>
                Lock answer
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm">
                {saved === q.correct ? (
                  <>
                    <Check className="size-4 text-sage" /> Correct
                  </>
                ) : (
                  <>
                    <X className="size-4 text-danger" /> Incorrect · answer {q.correct}
                  </>
                )}
              </span>
            )}
          </div>

          {locked ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-xs uppercase tracking-[0.16em] text-copper">Explanation</p>
              <ol className="mt-3 space-y-3">
                {q.explanation.map((step, i) => (
                  <li key={i}>
                    <p className="text-sm font-medium">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted">
                      <MathText text={step.content} />
                    </p>
                    {step.latex ? (
                      <div className="mt-1">
                        <MathTex tex={step.latex} display />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
              {q.commonMistakes?.length ? (
                <div className="mt-4 rounded-md bg-paper-2 p-3 text-sm">
                  <p className="font-medium">Common mistakes</p>
                  <ul className="mt-1 list-disc pl-4 text-muted">
                    {q.commonMistakes.map((m) => (
                      <li key={m}>
                        <MathText text={m} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        {idx < total - 1 ? (
          <Button variant="outline" onClick={() => setIdx((i) => i + 1)}>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button variant="copper" onClick={onFinish}>
            Submit test
          </Button>
        )}
      </div>
    </Shell>
  );
}
