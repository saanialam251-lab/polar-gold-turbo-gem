import { QUESTIONS, questionsFor } from "./questions";
import type {
  ClassId,
  CompletedTest,
  Difficulty,
  MasteryStatus,
  OptionId,
  Question,
  QuestionState,
  Subject,
  TestMode,
} from "./types";

export function statusOf(state?: QuestionState): MasteryStatus {
  return state?.status ?? "NEW";
}

export function updateStatus(
  prev: QuestionState | undefined,
  selected: OptionId | null,
  correct: boolean,
  questionId: string,
  timeTaken: number,
): QuestionState {
  const attempts = [
    ...(prev?.attempts ?? []),
    { questionId, selected, correct, at: Date.now(), timeTaken },
  ];
  // Mirrors the wrong pool's rule exactly: one attempt decides it. One wrong
  // answer surfaces a question in the wrong pool immediately; one correct
  // answer now retires it to the mastered pool immediately (previously this
  // required two in a row — kept as a single, symmetric rule instead).
  let consecutiveCorrect = prev?.consecutiveCorrect ?? 0;
  let status: MasteryStatus;
  if (!correct) {
    consecutiveCorrect = 0;
    status = "WRONG";
  } else {
    consecutiveCorrect += 1;
    status = "MASTERED";
  }
  return { status, attempts, consecutiveCorrect };
}

export function poolFor(params: {
  classId: ClassId;
  subject: Subject;
  chapterId: string;
  topicId?: string;
  /** Zero or more topics to restrict to. Empty/omitted = every topic in the chapter (mixed). */
  topicIds?: string[];
  mode: TestMode;
  difficulty: Difficulty;
  states: Record<string, QuestionState>;
}): Question[] {
  const { classId, subject, chapterId, topicId, topicIds, mode, difficulty, states } = params;
  let list = questionsFor(classId, subject, chapterId);
  if (topicIds && topicIds.length > 0) {
    list = list.filter((q) => topicIds.includes(q.topicId));
  } else if (topicId) {
    list = list.filter((q) => q.topicId === topicId);
  }
  if (mode === "pyq") list = list.filter((q) => q.isPyq);
  if (mode === "wrong") {
    list = list.filter((q) => statusOf(states[q.id]) === "WRONG");
  } else if (mode === "mastered") {
    list = list.filter((q) => statusOf(states[q.id]) === "MASTERED");
  } else if (mode === "topic" || mode === "practice" || mode === "chapter-mixed") {
    if (difficulty !== "mixed") {
      list = list.filter((q) => q.difficulty === difficulty);
    }
    list = list.filter((q) => statusOf(states[q.id]) !== "MASTERED");

    if (mode === "chapter-mixed") {
      /* keep all topics */
    }
  }
  return list;
}

/** Hard ceiling on how many questions any single test can offer, at any scope. */
export const MAX_TEST_QUESTIONS = 50;

/**
 * Pool for a subject-wide test (every chapter, every topic), used by the
 * "Start a subject test" action at the top of a subject page. Mirrors the
 * chapter-mixed pooling rule: mastered questions are excluded, difficulty
 * narrows the pool unless "mixed" is chosen.
 */
export function subjectPoolFor(params: {
  classId: ClassId;
  subject: Subject;
  difficulty: Difficulty;
  states: Record<string, QuestionState>;
  /** Zero or more topics (from any chapter in the subject) to restrict to. Empty/omitted = every topic. */
  topicIds?: string[];
}): Question[] {
  const { classId, subject, difficulty, states, topicIds } = params;
  let list = QUESTIONS.filter((q) => q.class === classId && q.subject === subject);
  if (topicIds && topicIds.length > 0) list = list.filter((q) => topicIds.includes(q.topicId));
  if (difficulty !== "mixed") list = list.filter((q) => q.difficulty === difficulty);
  list = list.filter((q) => statusOf(states[q.id]) !== "MASTERED");
  return list;
}

export function selectQuestions(
  pool: Question[],
  states: Record<string, QuestionState>,
  count: number,
  mode: TestMode,
): { selected: Question[]; exhausted: boolean; remaining: number } {
  const tagged = pool.map((q) => ({ q, s: statusOf(states[q.id]) }));
  let eligible: Question[];
  if (mode === "wrong" || mode === "mastered" || mode === "pyq") {
    // Review modes: every question in the pool is fair game, in random order.
    eligible = shuffle(tagged.map((t) => t.q));
  } else {
    // Practice modes: NEW first, then WRONG, then CORRECT. Each group is shuffled
    // on its own, but the group order is kept so "new first" really holds.
    const neu = tagged.filter((t) => t.s === "NEW").map((t) => t.q);
    const wrong = tagged.filter((t) => t.s === "WRONG").map((t) => t.q);
    const corr = tagged.filter((t) => t.s === "CORRECT").map((t) => t.q);
    eligible = [...shuffle(neu), ...shuffle(wrong), ...shuffle(corr)];
  }
  const selected = eligible.slice(0, count);
  return {
    selected,
    exhausted: selected.length === 0,
    remaining: eligible.length,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function scoreTest(
  questionIds: string[],
  answers: Record<string, OptionId | null>,
): { correct: number; wrong: number; skipped: number; score: number; maxScore: number } {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let score = 0;
  let maxScore = 0;
  for (const id of questionIds) {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) continue;
    maxScore += q.marksCorrect;
    const a = answers[id];
    if (a == null) {
      skipped += 1;
    } else if (a === q.correct) {
      correct += 1;
      score += q.marksCorrect;
    } else {
      wrong += 1;
      score += q.marksWrong;
    }
  }
  return { correct, wrong, skipped, score, maxScore };
}

export function chapterStats(
  classId: ClassId,
  subject: Subject,
  chapterId: string,
  states: Record<string, QuestionState>,
) {
  const qs = questionsFor(classId, subject, chapterId);
  const total = qs.length;
  let neu = 0,
    wrong = 0,
    mastered = 0,
    attempted = 0;
  for (const q of qs) {
    const s = statusOf(states[q.id]);
    if (s === "NEW") neu += 1;
    else {
      attempted += 1;
      if (s === "WRONG") wrong += 1;
      if (s === "MASTERED") mastered += 1;
    }
  }
  return { total, new: neu, wrong, mastered, attempted, remaining: neu + wrong };
}

export function overallStats(states: Record<string, QuestionState>, tests: CompletedTest[]) {
  const solved = Object.keys(states).length;
  let correct = 0;
  let wrong = 0;
  for (const st of Object.values(states)) {
    const last = st.attempts.at(-1);
    if (!last) continue;
    if (last.correct) correct += 1;
    else wrong += 1;
  }
  return {
    solved,
    correct,
    wrong,
    tests: tests.length,
    accuracy: solved ? Math.round((correct / solved) * 100) : 0,
  };
}

/**
 * Same shape as overallStats, but scoped to one class (9/10/11/12). Every
 * question id in `states` is looked up in QUESTIONS to find which class it
 * belongs to, so a Class 9 attempt never leaks into a Class 11 total and
 * vice versa — each class keeps its own separate analytics.
 */
export function classStats(
  classId: ClassId,
  states: Record<string, QuestionState>,
  tests: CompletedTest[],
) {
  const idsInClass = new Set(QUESTIONS.filter((q) => q.class === classId).map((q) => q.id));
  let solved = 0;
  let correct = 0;
  let wrong = 0;
  let mastered = 0;
  let inWrongPool = 0;
  for (const [id, st] of Object.entries(states)) {
    if (!idsInClass.has(id)) continue;
    solved += 1;
    if (st.status === "MASTERED") mastered += 1;
    if (st.status === "WRONG") inWrongPool += 1;
    const last = st.attempts.at(-1);
    if (!last) continue;
    if (last.correct) correct += 1;
    else wrong += 1;
  }
  const classTests = tests.filter((t) => t.class === classId);
  return {
    solved,
    correct,
    wrong,
    mastered,
    inWrongPool,
    tests: classTests.length,
    accuracy: solved ? Math.round((correct / solved) * 100) : 0,
  };
  }
