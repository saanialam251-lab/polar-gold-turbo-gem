export type ClassId = 9 | 10 | 11 | 12;
export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type Difficulty = "medium" | "hard" | "mixed";
export type OptionId = "A" | "B" | "C" | "D";
export type MasteryStatus = "NEW" | "WRONG" | "CORRECT" | "MASTERED";
export type TestMode =
  | "practice"
  | "wrong"
  | "pyq"
  | "chapter-mixed"
  | "mastered"
  | "topic"
  | "subject-mixed";

/** Sentinel chapterId used for a subject-wide test session (spans every chapter). */
export const SUBJECT_WIDE_CHAPTER_ID = "__subject-wide__";

export type Topic = {
  id: string;
  name: string;
  order: number;
};

export type Chapter = {
  id: string;
  name: string;
  order: number;
  topics: Topic[];
};

export type Question = {
  id: string;
  class: ClassId;
  subject: Subject;
  chapterId: string;
  topicId: string;
  difficulty: "medium" | "hard";
  type: "MCQ";
  isPyq: boolean;
  pyqYear?: number;
  pyqExam?: string;
  marksCorrect: number;
  marksWrong: number;
  questionText: string;
  latex?: string;
  options: { id: OptionId; text: string; latex?: string }[];
  correct: OptionId;
  explanation: { title: string; content: string; latex?: string }[];
  concepts: string[];
  formulaUsed?: string;
  commonMistakes?: string[];
};

export type AttemptRecord = {
  questionId: string;
  selected: OptionId | null;
  correct: boolean;
  at: number;
  timeTaken: number;
};

export type QuestionState = {
  status: MasteryStatus;
  attempts: AttemptRecord[];
  consecutiveCorrect: number;
};

export type TestSession = {
  id: string;
  class: ClassId;
  subject: Subject;
  chapterId: string;
  topicId?: string;
  mode: TestMode;
  difficulty: Difficulty;
  questionIds: string[];
  answers: Record<string, OptionId | null>;
  locked: Record<string, boolean>;
  startedAt: number;
  completedAt?: number;
  timePerQuestion: Record<string, number>;
};

export type CompletedTest = {
  id: string;
  class: ClassId;
  subject: Subject;
  chapterId: string;
  topicId?: string;
  mode: TestMode;
  difficulty: Difficulty;
  questionIds: string[];
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  startedAt: number;
  completedAt: number;
};
