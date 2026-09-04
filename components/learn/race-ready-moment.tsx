import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RaceReadyMoment({ fan = false }: { fan?: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-teal/25 bg-surface-02 p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,var(--sepang-teal),var(--sepang-teal-deep))]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-10 right-3 font-display text-[9rem] font-extrabold leading-none text-white/[0.045] sm:text-[12rem]"
      >
        56
      </div>

      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex size-11 items-center justify-center rounded-md border border-teal/40 bg-teal/10 text-teal">
          <Check aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.16em] text-teal">
          Race Ready
        </p>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl">
          {fan ? "Skip straight to Sepang" : "You know enough to follow the action"}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-6 text-text-secondary">
          {fan
            ? "You already follow F1, so the beginner lessons are optional. Meet the circuit and see where the race can come alive."
            : "The basics are covered. Next, see where those ideas matter around Sepang."}
        </p>
        <div className="mt-7">
          <Button asChild size="large" className="w-full sm:w-auto">
            <Link href="/sepang">
              Meet Sepang
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
