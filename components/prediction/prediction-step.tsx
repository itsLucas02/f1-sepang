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
    <div className="panel-enter relative min-h-[calc(100vh-56px)] bg-canvas pb-32 text-foreground">
      <div
        aria-hidden="true"
        className="sepang-glow pointer-events-none absolute inset-x-0 top-0 h-[600px]"
      />
      <div
        aria-hidden="true"
        className="race-grid pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-50"
      />

      <section className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
        {/* progress */}
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-race-red">
            {progress}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] shadow-[0_0_12px_rgba(232,17,45,0.6)] transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted sm:block">
            Race calls
          </span>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:items-end">
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.84] tracking-[-0.035em] text-white sm:text-6xl lg:col-span-8 lg:text-7xl">
            {heading}
          </h1>
          <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg lg:col-span-4">
            {helper}
          </p>
        </div>

        <div className="mt-9 border-t border-white/10 pt-8 sm:mt-11 sm:pt-10">
          {children}
        </div>
      </section>

      {/* sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-header/92 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 sm:px-8">
          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] sm:flex">
            <span
              aria-hidden="true"
              className={
                canContinue
                  ? "size-2 rounded-full bg-teal shadow-[0_0_10px_var(--sepang-teal)]"
                  : "size-2 rounded-full bg-white/25"
              }
            />
            <span className={canContinue ? "text-teal" : "text-text-muted"}>
              {canContinue ? "Selection ready" : "Choose an answer"}
            </span>
          </span>
          <Button
            type="button"
            size="large"
            disabled={!canContinue}
            onClick={onContinue}
            className="w-full sm:ml-auto sm:flex sm:w-auto sm:min-w-52"
          >
            {continueLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
