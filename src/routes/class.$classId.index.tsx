import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FlaskConical, Sigma } from "lucide-react";
import { CLASS_META, SUBJECTS, SYLLABUS } from "@/lib/syllabus";
import { QUESTIONS } from "@/lib/questions";
import { Shell } from "@/components/shell";
import { useAppStore } from "@/lib/store";
import type { ClassId, Subject } from "@/lib/types";

export const Route = createFileRoute("/class/$classId/")({ component: ClassPage });

const ICONS: Record<Subject, typeof BookOpen> = {
  Physics: BookOpen,
  Chemistry: FlaskConical,
  Mathematics: Sigma,
};

function ClassPage() {
  const { classId: raw } = Route.useParams();
  const classId = Number(raw) as ClassId;
  const meta = CLASS_META[classId];
  const setProfile = useAppStore((s) => s.setProfile);
  if (!meta) {
    return (
      <Shell title="Unknown class">
        <p>That class is not in the syllabus map.</p>
      </Shell>
    );
  }
  return (
    <Shell eyebrow="Syllabus" title={meta.label}>
      <p className="mb-6 max-w-xl text-muted">{meta.note}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {SUBJECTS.map((subject) => {
          const Icon = ICONS[subject];
          const chapters = SYLLABUS[classId][subject];
          const nQ = QUESTIONS.filter((q) => q.class === classId && q.subject === subject).length;
          return (
            <Link
              key={subject}
              to="/class/$classId/$subject"
              params={{ classId: String(classId), subject }}
              onClick={() => setProfile({ classId })}
              className="rounded-lg border border-line bg-paper p-5 text-ink no-underline hover:border-copper"
            >
              <Icon className="size-5 text-copper" />
              <p className="mt-3 font-display text-2xl">{subject}</p>
              <p className="mt-1 text-sm text-muted">{chapters.length} chapters</p>
              <p className="mt-2 text-xs text-copper">
                {nQ > 0 ? `${nQ} questions seeded` : "Syllabus mapped · bank expanding"}
              </p>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
