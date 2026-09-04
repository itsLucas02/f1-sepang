"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { FamiliarityCard } from "@/components/learn/familiarity-card";
import { LessonStep } from "@/components/learn/lesson-step";
import { RaceReadyMoment } from "@/components/learn/race-ready-moment";
import { Button } from "@/components/ui/button";
import { LESSONS, getLesson, type LessonId } from "@/content/lessons";
import {
  LEARN_STORAGE_KEY,
  getNextRecommendedLessonId,
  getRecommendedLessonIds,
  isRaceReady,
  parsePersistedLearnState,
  type KnowledgeLevel,
} from "@/lib/learn";
import { cn } from "@/lib/utils";

const FAMILIARITY_OPTIONS: readonly {
  level: KnowledgeLevel;
  title: string;
  description: string;
}[] = [
  {
    level: "beginner",
    title: "I'm completely new",
    description: "Start with the full six-lesson race-day primer.",
  },
  {
    level: "basics",
    title: "I know some basics",
    description: "Skip the opening lessons and focus on racing, tyres and what to watch.",
  },
  {
    level: "fan",
    title: "I already follow F1",
    description: "Head straight to Sepang. The Learn lessons stay available whenever you want them.",
  },
] as const;

export function LearnExperience() {
  const [hydrated, setHydrated] = useState(false);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel | null>(null);
  const [draftKnowledgeLevel, setDraftKnowledgeLevel] =
    useState<KnowledgeLevel | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<LessonId[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<LessonId | null>(null);
  const [showFamiliarity, setShowFamiliarity] = useState(true);

  useEffect(() => {
    const stored = parsePersistedLearnState(
      window.localStorage.getItem(LEARN_STORAGE_KEY),
    );

    setKnowledgeLevel(stored.knowledgeLevel);
    setDraftKnowledgeLevel(stored.knowledgeLevel);
    setCompletedLessonIds(stored.completedLessonIds);
    setShowFamiliarity(stored.knowledgeLevel === null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      LEARN_STORAGE_KEY,
      JSON.stringify({ knowledgeLevel, completedLessonIds }),
    );
  }, [completedLessonIds, hydrated, knowledgeLevel]);

  const recommendedLessonIds = useMemo(
    () => (knowledgeLevel ? getRecommendedLessonIds(knowledgeLevel) : []),
    [knowledgeLevel],
  );

  const recommendedSet = useMemo(
    () => new Set<LessonId>(recommendedLessonIds),
    [recommendedLessonIds],
  );

  const ready = knowledgeLevel
    ? isRaceReady(knowledgeLevel, completedLessonIds)
    : false;

  const completedRecommendedCount = recommendedLessonIds.filter((lessonId) =>
    completedLessonIds.includes(lessonId),
  ).length;

  if (!hydrated) {
    return (
      <section className="rounded-lg border border-white/10 bg-surface-01 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
          Preparing your race-ready path…
        </p>
      </section>
    );
  }

  if (showFamiliarity) {
    return (
      <section aria-labelledby="familiarity-title">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 bg-race-red" />
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              F1 Familiarity Check
            </p>
          </div>
          <h1
            id="familiarity-title"
            className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
          >
            How familiar are you with F1?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Pick the closest fit. This only changes which lessons we recommend — nothing is locked.
          </p>
        </div>

        <fieldset className="mt-10 grid gap-4 lg:grid-cols-3">
          <legend className="sr-only">Choose your F1 familiarity</legend>
          {FAMILIARITY_OPTIONS.map((option) => (
            <FamiliarityCard
              key={option.level}
              {...option}
              selected={draftKnowledgeLevel === option.level}
              onSelect={setDraftKnowledgeLevel}
            />
          ))}
        </fieldset>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
          {knowledgeLevel ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDraftKnowledgeLevel(knowledgeLevel);
                setShowFamiliarity(false);
              }}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={!draftKnowledgeLevel}
            onClick={() => {
              if (!draftKnowledgeLevel) {
                return;
              }

              setKnowledgeLevel(draftKnowledgeLevel);
              setShowFamiliarity(false);
              setActiveLessonId(
                getNextRecommendedLessonId(
                  draftKnowledgeLevel,
                  completedLessonIds,
                ),
              );
            }}
          >
            Continue
          </Button>
        </div>
      </section>
    );
  }

  if (!knowledgeLevel) {
    return null;
  }

  if (activeLessonId) {
    const lesson = getLesson(activeLessonId);

    return (
      <LessonStep
        lesson={lesson}
        recommended={recommendedSet.has(activeLessonId)}
        completed={completedLessonIds.includes(activeLessonId)}
        onBack={() => setActiveLessonId(null)}
        onContinue={() => {
          const nextCompleted = completedLessonIds.includes(activeLessonId)
            ? completedLessonIds
            : [...completedLessonIds, activeLessonId];

          setCompletedLessonIds(nextCompleted);
          setActiveLessonId(
            getNextRecommendedLessonId(
              knowledgeLevel,
              nextCompleted,
              activeLessonId,
            ),
          );
        }}
      />
    );
  }

  const nextRecommendedLessonId = getNextRecommendedLessonId(
    knowledgeLevel,
    completedLessonIds,
  );

  return (
    <div>
      <section className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 bg-race-red" />
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              Learn / Race School
            </p>
          </div>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            Your Race Ready Path
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            Six short lessons cover the F1 basics that matter on race day. Your recommended path is highlighted below.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setDraftKnowledgeLevel(knowledgeLevel);
            setShowFamiliarity(true);
          }}
        >
          Change Familiarity
        </Button>
      </section>

      {ready ? (
        <div className="mt-8">
          <RaceReadyMoment fan={knowledgeLevel === "fan"} />
        </div>
      ) : (
        <section className="relative mt-8 overflow-hidden rounded-lg border border-white/10 bg-surface-02 p-6 text-white sm:p-8">
          <span aria-hidden="true" className="absolute -right-24 -top-24 size-64 rounded-full bg-race-red/15 blur-3xl" />
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
                Recommended progress
              </p>
              <p className="mt-2 font-display text-3xl font-bold uppercase text-white">
                {completedRecommendedCount} / {recommendedLessonIds.length} complete
              </p>
            </div>
            <span className="font-mono text-xs text-text-secondary">
              {Math.round(
                (completedRecommendedCount / recommendedLessonIds.length) * 100,
              )}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Recommended lesson progress"
            aria-valuemin={0}
            aria-valuemax={recommendedLessonIds.length}
            aria-valuenow={completedRecommendedCount}
            className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] shadow-[0_0_12px_rgba(232,17,45,0.6)] transition-[width] duration-500"
              style={{
                width: `${(completedRecommendedCount / recommendedLessonIds.length) * 100}%`,
              }}
            />
          </div>
        </section>
      )}

      <section aria-labelledby="lesson-list-title" className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-race-red">
              All lessons
            </p>
            <h2
              id="lesson-list-title"
              className="mt-3 font-display text-4xl font-bold uppercase leading-none text-white"
            >
              Learn at your pace
            </h2>
          </div>

          {!ready && nextRecommendedLessonId ? (
            <Button
              type="button"
              onClick={() => setActiveLessonId(nextRecommendedLessonId)}
            >
              Continue Recommended
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-surface-01 divide-y divide-white/8">
          {LESSONS.map((lesson) => {
            const completed = completedLessonIds.includes(lesson.id);
            const recommended = recommendedSet.has(lesson.id);

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonId(lesson.id)}
                className="group grid min-h-24 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal sm:gap-6 sm:px-6"
              >
                <span className="font-mono text-sm font-medium text-race-red">
                  {lesson.id}
                </span>
                <span>
                  <span className="block font-display text-xl font-bold uppercase leading-none text-white sm:text-2xl">
                    {lesson.shortTitle}
                  </span>
                  <span className="mt-2 block text-sm text-text-muted">
                    {recommended ? "Recommended for you" : "Optional lesson"}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-sm border transition-colors",
                    completed
                      ? "border-race-red bg-race-red/10 text-race-red"
                      : "border-white/15 text-text-muted group-hover:border-white/35 group-hover:text-white",
                  )}
                >
                  {completed ? (
                    <Check aria-label="Completed" className="size-4" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="size-4" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
