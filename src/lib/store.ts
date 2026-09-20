import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateStatus } from "./engine";
import { QUESTIONS } from "./questions";
import type {
  ClassId,
  CompletedTest,
  OptionId,
  QuestionState,
  TestSession,
} from "./types";

type Profile = {
  name: string;
  classId: ClassId;
};

type Store = {
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  states: Record<string, QuestionState>;
  tests: CompletedTest[];
  bookmarks: string[];
  active: TestSession | null;
  startTest: (session: TestSession) => void;
  lockAnswer: (questionId: string, selected: OptionId | null, timeTaken: number) => void;
  finishTest: () => CompletedTest | null;
  toggleBookmark: (id: string) => void;
  resetProgress: () => void;
};

function lookupCorrect(id: string): OptionId | null {
  return QUESTIONS.find((q) => q.id === id)?.correct ?? null;
}

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      profile: { name: "Student", classId: 11 },
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      states: {},
      tests: [],
      bookmarks: [],
      active: null,
      startTest: (session) => set({ active: session }),
      lockAnswer: (questionId, selected, timeTaken) => {
        const active = get().active;
        if (!active || active.locked[questionId]) return;
        const isCorrect = selected != null && selected === lookupCorrect(questionId);
        set((s) => {
          if (!s.active) return s;
          return {
            active: {
              ...s.active,
              answers: { ...s.active.answers, [questionId]: selected },
              locked: { ...s.active.locked, [questionId]: true },
              timePerQuestion: { ...s.active.timePerQuestion, [questionId]: timeTaken },
            },
            states: {
              ...s.states,
              [questionId]: updateStatus(
                s.states[questionId],
                selected,
                isCorrect,
                questionId,
                timeTaken,
              ),
            },
          };
        });
      },
      finishTest: () => {
        const active = get().active;
        if (!active) return null;
        let correct = 0,
          wrong = 0,
          skipped = 0,
          score = 0,
          maxScore = 0;
        for (const id of active.questionIds) {
          maxScore += 4;
          const a = active.answers[id];
          if (a == null && !active.locked[id]) skipped += 1;
          else if (a === lookupCorrect(id)) {
            correct += 1;
            score += 4;
          } else {
            wrong += 1;
            score -= 1;
          }
        }
        const completed: CompletedTest = {
          id: active.id,
          class: active.class,
          subject: active.subject,
          chapterId: active.chapterId,
          topicId: active.topicId,
          mode: active.mode,
          difficulty: active.difficulty,
          questionIds: active.questionIds,
          correct,
          wrong,
          skipped,
          score,
          maxScore,
          startedAt: active.startedAt,
          completedAt: Date.now(),
        };
        set((s) => ({
          active: null,
          tests: [completed, ...s.tests].slice(0, 40),
        }));
        return completed;
      },
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),
      resetProgress: () => set({ states: {}, tests: [], bookmarks: [], active: null }),
    }),
    { name: "orbit-cbse-v1", skipHydration: true },
  ),
);
