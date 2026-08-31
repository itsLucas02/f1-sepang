import { LESSON_IDS, type LessonId } from "@/content/lessons";

export type KnowledgeLevel = "beginner" | "basics" | "fan";

export const LEARN_STORAGE_KEY = "sepang56.learn";

export const RECOMMENDED_LESSONS: Record<
  KnowledgeLevel,
  readonly LessonId[]
> = {
  beginner: ["01", "02", "03", "04", "05", "06"],
  basics: ["03", "04", "05", "06"],
  fan: [],
};

export type PersistedLearnState = {
  knowledgeLevel: KnowledgeLevel | null;
  completedLessonIds: LessonId[];
};

export function isKnowledgeLevel(value: unknown): value is KnowledgeLevel {
  return value === "beginner" || value === "basics" || value === "fan";
}

export function isLessonId(value: unknown): value is LessonId {
  return typeof value === "string" && LESSON_IDS.includes(value as LessonId);
}

export function getRecommendedLessonIds(level: KnowledgeLevel) {
  return RECOMMENDED_LESSONS[level];
}

export function isRaceReady(
  level: KnowledgeLevel,
  completedLessonIds: readonly LessonId[],
) {
  const completed = new Set(completedLessonIds);
  return RECOMMENDED_LESSONS[level].every((lessonId) => completed.has(lessonId));
}

export function getNextRecommendedLessonId(
  level: KnowledgeLevel,
  completedLessonIds: readonly LessonId[],
  currentLessonId?: LessonId,
) {
  const completed = new Set(completedLessonIds);
  const recommended = RECOMMENDED_LESSONS[level];

  if (currentLessonId) {
    const currentIndex = recommended.indexOf(currentLessonId);
    const afterCurrent = recommended
      .slice(currentIndex >= 0 ? currentIndex + 1 : 0)
      .find((lessonId) => !completed.has(lessonId));

    if (afterCurrent) {
      return afterCurrent;
    }
  }

  return recommended.find((lessonId) => !completed.has(lessonId)) ?? null;
}

export function parsePersistedLearnState(raw: string | null): PersistedLearnState {
  const fallback: PersistedLearnState = {
    knowledgeLevel: null,
    completedLessonIds: [],
  };

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as {
      knowledgeLevel?: unknown;
      completedLessonIds?: unknown;
    };

    const knowledgeLevel = isKnowledgeLevel(parsed.knowledgeLevel)
      ? parsed.knowledgeLevel
      : null;

    const completedLessonIds = Array.isArray(parsed.completedLessonIds)
      ? Array.from(new Set(parsed.completedLessonIds.filter(isLessonId)))
      : [];

    return { knowledgeLevel, completedLessonIds };
  } catch {
    return fallback;
  }
}
