import { createFileRoute, Link } from "@tanstack/react-router";
import { questionById } from "@/lib/questions";
import { getChapter } from "@/lib/syllabus";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import { MathText } from "@/components/math";
import { SUBJECT_WIDE_CHAPTER_ID } from "@/lib/types";

export const Route = createFileRoute("/result/$testId")({ component: ResultPage });

function ResultPage() {
  const { testId } = Route.useParams();
  const test = useAppStore((s) => s.tests.find((t) => t.id === testId));
  if (!test) {
    return (
      <Shell title="Result not found">
        <p className="text-muted">That test is not in this device’s history.</p>
      </Shell>
    );
  }
  const chapter = getChapter(test.class, test.subject, test.chapterId);
  const pct = test.maxScore ? Math.round((Math.max(0, test.score) / test.maxScore) * 100) : 0;

  return (
    <Shell eyebrow="Result" title={chapter?.name ?? "Test"}>
      <div className="grid gap-3 sm:grid-cols-4">
        <Card k="Score" v={`${test.score} / ${test.maxScore}`} />
        <Card k="Correct" v={String(test.correct)} />
        <Card k="Wrong" v={String(test.wrong)} />
        <Card k="Skipped" v={String(test.skipped)} />
      </div>
      <p className="mt-4 text-sm text-muted">
        {pct}% of maximum marks · {test.questionIds.length} questions · {test.difficulty} · {test.mode}
      </p>
      <ol className="mt-6 divide-y divide-line rounded-lg border border-line">
        {test.questionIds.map((id, i) => {
          const q = questionById(id);
          if (!q) return null;
          const st = useAppStore.getState().states[id];
          const last = st?.attempts.at(-1);
          const ok = last?.correct;
          return (
            <li key={id} className="flex items-start gap-3 px-4 py-3">
              <span className="text-xs text-muted tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <MathText text={q.questionText} />
                </p>
                <p className="text-xs text-muted">
                  {ok ? "Correct" : last?.selected ? `Chose ${last.selected} · key ${q.correct}` : "Skipped"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        {test.chapterId === SUBJECT_WIDE_CHAPTER_ID ? (
          <Link
            to="/class/$classId/$subject"
            params={{ classId: String(test.class), subject: test.subject }}
            className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper no-underline"
          >
            Back to {test.subject}
          </Link>
        ) : (
          <Link
            to="/class/$classId/$subject/$chapter"
            params={{
              classId: String(test.class),
              subject: test.subject,
              chapter: test.chapterId,
            }}
            className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper no-underline"
          >
            Back to chapter
          </Link>
        )}
        <Link
          to="/progress"
          className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm font-medium text-ink no-underline"
        >
          Progress
        </Link>
      </div>
    </Shell>
  );
}

function Card({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs text-muted">{k}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{v}</p>
    </div>
  );
}
