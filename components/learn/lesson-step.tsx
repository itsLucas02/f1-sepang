import { ArrowLeft, Check } from "lucide-react";

import { LessonVisual } from "@/components/learn/lesson-visual";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/lessons";

type LessonStepProps = {
  lesson: Lesson;
  recommended: boolean;
  completed: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export function LessonStep({
  lesson,
  recommended,
  completed,
  onBack,
  onContinue,
}: LessonStepProps) {
  return (
    <section aria-labelledby={`lesson-${lesson.id}-title`}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Learn
      </button>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6 lg:pr-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
              {lesson.id} / 06
            </span>
            <span className="h-px w-8 bg-border" aria-hidden="true" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {recommended ? "Recommended" : "Optional"}
            </span>
            {completed ? (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary">
                <Check aria-hidden="true" className="size-3.5" /> Complete
              </span>
            ) : null}
          </div>

          <h1
            id={`lesson-${lesson.id}-title`}
            className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl"
          >
            {lesson.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-7 text-text-secondary">
            {lesson.intro}
          </p>

          <ul className="mt-8 space-y-4">
            {lesson.points.map((point, index) => (
              <li key={point} className="flex gap-4">
                <span className="mt-0.5 font-mono text-xs text-race-red">
                  0{index + 1}
                </span>
                <span className="text-base leading-6 text-text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <LessonVisual kind={lesson.visual} />

          <div className="mt-4 border-l-2 border-race-red bg-surface-01 p-5 sm:p-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Remember this
            </p>
            <p className="mt-3 text-base leading-6 text-white">{lesson.takeaway}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end border-t border-border pt-6">
        <Button type="button" onClick={onContinue} className="w-full sm:w-auto">
          {completed ? "Continue" : "Got It"}
        </Button>
      </div>
    </section>
  );
}
