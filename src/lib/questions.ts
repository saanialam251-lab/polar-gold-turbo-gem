import type { ClassId, Question, Subject } from "./types";
import { QUESTIONS_01 } from "./questions01";
import { QUESTIONS_02 } from "./questions02";
import { QUESTIONS_03 } from "./questions03";
import { QUESTIONS_04 } from "./questions04";
import { QUESTIONS_05 } from "./questions05";

export const QUESTIONS: Question[] = [
  ...QUESTIONS_01,
  ...QUESTIONS_02,
  ...QUESTIONS_03,
  ...QUESTIONS_04,
  ...QUESTIONS_05,
];

const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function questionById(id: string): Question | undefined {
  return QUESTION_BY_ID.get(id);
}

export function questionsFor(
  classId: ClassId,
  subject: Subject,
  chapterId: string,
): Question[] {
  return QUESTIONS.filter(
    (q) => q.class === classId && q.subject === subject && q.chapterId === chapterId,
  );
}

export function countForChapter(
  classId: ClassId,
  subject: Subject,
  chapterId: string,
): number {
  return questionsFor(classId, subject, chapterId).length;
}
