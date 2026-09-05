import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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
    <section aria-labelledby={`lesson-${lesson.id}-title`} className="panel-enter">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Race School
      </button>

      <div className="mt-7 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pr-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-5xl font-extrabold leading-none text-race-red">
              {lesson.id}
            </span>
            <span className="h-8 w-px bg-white/15" aria-hidden="true" />
            <div>
              <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-text-secondary">
                Lesson {lesson.id} / 06
              </span>
              <span className="mt-1 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                {recommended ? "Recommended route" : "Optional briefing"}
              </span>
            </div>
            {completed ? (
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-sm border border-teal/30 bg-teal/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-teal">
                <Check aria-hidden="true" className="size-3.5" /> Complete
              </span>
            ) : null}
          </div>

          <h1
            id={`lesson-${lesson.id}-title`}
            className="mt-7 max-w-2xl font-display text-5xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-white sm:text-6xl"
          >
            {lesson.title}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-text-secondary sm:text-xl">
            {lesson.intro}
          </p>

          <ol className="mt-9 border-t border-white/10">
            {lesson.points.map((point, index) => (
              <li
                key={point}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-white/8 py-4"
              >
                <span className="pt-1 font-mono text-[10px] text-race-red">
                  0{index + 1}
                </span>
                <span className="text-base leading-7 text-text-secondary">{point}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6">
          <LessonVisual kind={lesson.visual} />

          <div className="relative mt-4 overflow-hidden rounded-lg border border-race-red/25 bg-surface-02 p-6 text-white sm:p-7">
            <span aria-hidden="true" className="absolute -right-20 -top-20 size-52 rounded-full bg-race-red/20 blur-3xl" />
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-race-red" />
            <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-race-red">
              Remember this
            </p>
            <p className="relative mt-3 font-display text-2xl font-bold uppercase leading-[1.05] sm:text-3xl">
              {lesson.takeaway}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end border-t border-white/10 pt-6">
        <Button type="button" size="large" onClick={onContinue} className="w-full sm:w-auto sm:min-w-48">
          {completed ? "Continue" : "Got It"}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
