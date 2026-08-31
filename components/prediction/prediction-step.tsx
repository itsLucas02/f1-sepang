import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PredictionStep({
  progress,
  heading,
  helper,
  children,
  canContinue,
  onContinue,
  continueLabel = "Next",
}: {
  progress: string;
  heading: string;
  helper: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div className="pb-28 sm:pb-32">
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
        <span className="inline-flex min-h-8 items-center rounded-md border border-border bg-surface-03 px-3 font-mono text-xs font-medium tracking-[0.1em] text-race-red">
          {progress}
        </span>

        <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-6 text-text-secondary sm:text-lg sm:leading-7">
          {helper}
        </p>

        <div className="mt-8 sm:mt-10">{children}</div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas/95 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="w-full sm:ml-auto sm:flex sm:w-auto sm:min-w-44"
          >
            {continueLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
