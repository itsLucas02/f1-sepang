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
        className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[#626268] transition-colors hover:text-[#111113] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Race School
      </button>

      <div className="mt-7 grid gap-10 border-t border-black/12 pt-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pr-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-5xl font-extrabold leading-none text-race-red">
              {lesson.id}
            </span>
            <span className="h-8 w-px bg-black/15" aria-hidden="true" />
            <div>
              <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#5f5f65]">
                Lesson {lesson.id} / 06
              </span>
              <span className="mt-1 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#85858b]">
                {recommended ? "Recommended route" : "Optional briefing"}
              </span>
            </div>
            {completed ? (
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#66666c]">
                <Check aria-hidden="true" className="size-3.5 text-race-red" /> Complete
              </span>
            ) : null}
          </div>

          <h1
            id={`lesson-${lesson.id}-title`}
            className="mt-7 max-w-2xl font-display text-6xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-[#111113] sm:text-7xl"
          >
            {lesson.title}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-7 text-[#55555b] sm:text-xl sm:leading-8">
            {lesson.intro}
          </p>

          <ol className="mt-9 border-t border-black/12">
            {lesson.points.map((point, index) => (
              <li
                key={point}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-black/10 py-4"
              >
                <span className="font-mono text-[10px] text-race-red">
                  0{index + 1}
                </span>
                <span className="text-base leading-6 text-[#3f3f44]">{point}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6">
          <LessonVisual kind={lesson.visual} />

          <div className="mt-4 bg-[#111113] p-6 text-white sm:p-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-race-red">
              Remember this
            </p>
            <p className="mt-3 font-display text-2xl font-bold uppercase leading-[1.02] sm:text-3xl">
              {lesson.takeaway}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end border-t border-black/12 pt-6">
        <Button type="button" onClick={onContinue} className="w-full sm:w-auto sm:min-w-44">
          {completed ? "Continue" : "Got It"}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </section>
  );
}
