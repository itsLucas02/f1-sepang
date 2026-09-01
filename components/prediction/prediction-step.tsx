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
  const current = Number(progress.slice(0, 2));
  const percent = Number.isFinite(current) ? (current / 8) * 100 : 0;

  return (
    <div className="panel-enter min-h-[calc(100vh-56px)] bg-[#f4f3ef] pb-28 text-[#111113] sm:pb-32">
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs font-medium tracking-[0.12em] text-race-red">
            {progress}
          </span>
          <div className="h-1 flex-1 overflow-hidden bg-black/10">
            <div
              className="h-full bg-race-red transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.13em] text-[#74747a] sm:block">
            Race calls
          </span>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:items-end">
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-[#111113] sm:text-6xl lg:col-span-8 lg:text-7xl">
            {heading}
          </h1>
          <p className="max-w-xl text-base leading-6 text-[#55555b] sm:text-lg sm:leading-7 lg:col-span-4">
            {helper}
          </p>
        </div>

        <div className="mt-9 border-t border-black/12 pt-8 sm:mt-11 sm:pt-10">
          {children}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#f7f6f2]/96 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 sm:px-8">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.13em] text-[#74747a] sm:block">
            {canContinue ? "Selection ready" : "Choose an answer"}
          </span>
          <Button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="w-full sm:ml-auto sm:flex sm:w-auto sm:min-w-48"
          >
            {continueLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
