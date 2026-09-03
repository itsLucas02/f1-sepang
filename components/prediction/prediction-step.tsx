import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import textures from "@/components/shared/motorsport-textures.module.css";
import { Button } from "@/components/ui/button";
import { PREDICTION_QUESTIONS } from "@/content/predictions";
import { publicAsset } from "@/lib/assets";

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
  const currentQuestion = PREDICTION_QUESTIONS[Math.max(0, current - 1)];

  return (
    <div className="panel-enter relative min-h-[calc(100vh-56px)] bg-[#070708] pb-36 text-foreground">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050506]">
        <div className="absolute inset-y-0 right-0 w-[64%] max-lg:hidden">
          <Image
            src={publicAsset("/media/prediction/intro.webp")}
            alt="Formula-style cars racing at Sepang"
            fill
            priority
            sizes="64vw"
            className="object-cover object-[62%_52%] contrast-105 saturate-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050506] via-[#050506]/22 to-black/5" aria-hidden="true" />
        </div>
        <div className={`${textures.carbonFade} pointer-events-none absolute inset-y-0 left-0 w-[58%] opacity-70 max-lg:hidden`} aria-hidden="true" />
        <div className="race-noise pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
          <div className="max-w-4xl lg:max-w-[52%]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-semibold tracking-[0.16em] text-race-red">
                {progress}
              </span>
              <span className={textures.stripeFlagSmall} aria-hidden="true" />
            </div>

            <h1 className="mt-5 font-display text-6xl font-extrabold uppercase italic leading-[0.8] tracking-[-0.045em] text-white sm:text-7xl lg:text-[6.5rem]">
              {heading}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              {helper}
            </p>
          </div>
        </div>
        <div className={`${textures.stripeBand} absolute inset-x-0 bottom-0 h-1 opacity-90`} aria-hidden="true" />
      </section>

      <section className="relative mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </section>

      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/14 bg-[#050506]/96 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl ${textures.rubberGrain}`}>
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className={`hidden h-[76px] overflow-hidden border border-white/12 bg-[#09090b] lg:grid lg:grid-cols-[minmax(0,1fr)_224px] ${textures.carbonPanel}`}>
            <div className="grid min-w-0 grid-cols-8">
              {PREDICTION_QUESTIONS.map((item, index) => {
                const active = index + 1 === current;
                const passed = index + 1 < current;

                return (
                  <div key={item.id} className="relative min-w-0 border-r border-white/10 px-3 py-3 last:border-r-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          active
                            ? "flex size-7 items-center justify-center rounded-full border border-race-red bg-race-red font-mono text-[9px] font-semibold text-white"
                            : passed
                              ? "flex size-7 items-center justify-center rounded-full border border-white/30 bg-white/10 font-mono text-[9px] text-white/75"
                              : "flex size-7 items-center justify-center rounded-full border border-white/20 font-mono text-[9px] text-white/35"
                        }
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className={active ? "mt-2 truncate font-mono text-[8px] uppercase tracking-[0.11em] text-white" : "mt-2 truncate font-mono text-[8px] uppercase tracking-[0.11em] text-white/35"}>
                      {item.summaryLabel}
                    </p>
                    {active ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-race-red" aria-hidden="true" /> : null}
                  </div>
                );
              })}
            </div>

            <Button
              type="button"
              size="large"
              disabled={!canContinue}
              onClick={onContinue}
              className="sheen h-full min-h-0 rounded-none border-0 border-l border-race-red bg-race-red px-10 py-0 font-display text-lg font-extrabold uppercase italic tracking-[0.08em]"
            >
              {continueLabel}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
                {currentQuestion?.summaryLabel ?? "Race call"}
              </p>
              <div className="mt-2 h-1 overflow-hidden bg-white/10">
                <div className="h-full bg-race-red transition-[width] duration-300" style={{ width: `${(current / 8) * 100}%` }} />
              </div>
            </div>
            <Button
              type="button"
              size="large"
              disabled={!canContinue}
              onClick={onContinue}
              className="sheen min-w-36 rounded-none uppercase tracking-[0.05em]"
            >
              {continueLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
