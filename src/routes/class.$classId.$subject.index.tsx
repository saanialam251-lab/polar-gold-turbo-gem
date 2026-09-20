import { createFileRoute, Link } from "@tanstack/react-router";
import { SYLLABUS } from "@/lib/syllabus";
import { countForChapter } from "@/lib/questions";
import { chapterStats } from "@/lib/engine";
import { useAppStore } from "@/lib/store";
import { Shell } from "@/components/shell";
import type { ClassId, Subject } from "@/lib/types";

export const Route = createFileRoute("/class/$classId/$subject/")({ component: SubjectPage });

function SubjectPage() {
  const { classId: raw, subject: subRaw } = Route.useParams();
  const classId = Number(raw) as ClassId;
  const subject = decodeURIComponent(subRaw) as Subject;
  const chapters = SYLLABUS[classId]?.[subject];
  const states = useAppStore((s) => s.states);

  if (!chapters) {
    return (
      <Shell title="Not found">
        <p>Unknown subject.</p>
      </Shell>
    );
  }

  return (
    <Shell eyebrow={`Class ${classId}`} title={subject}>
      <p className="mb-6 text-sm text-muted">
        Every chapter lists its topics. Open one to practise, retry wrongs, or sit mixed tests.
      </p>
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
