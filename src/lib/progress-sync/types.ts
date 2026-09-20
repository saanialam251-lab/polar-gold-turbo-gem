import type { ClassId, CompletedTest, QuestionState } from "@/lib/types";

/** Everything that follows a signed-in student between devices. */
export type SyncedProgress = {
  profile: { name: string; classId: ClassId };
  states: Record<string, QuestionState>;
  tests: CompletedTest[];
  bookmarks: string[];
  /** Client clock at the moment this snapshot was produced, for merge tie-breaks. */
  savedAt: number;
};
