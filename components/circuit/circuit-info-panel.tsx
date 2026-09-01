"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SepangHotspot } from "@/content/sepang";
import type { TourMode } from "@/lib/sepang";

type CircuitInfoPanelProps = {
  hotspot: SepangHotspot;
  tourMode: TourMode;
  sepangReady: boolean;
  hasNextHotspot: boolean;
  onNextHotspot: () => void;
};

export function CircuitInfoPanel({
  hotspot,
  tourMode,
  sepangReady,
  hasNextHotspot,
  onNextHotspot,
}: CircuitInfoPanelProps) {
  return (
    <aside className="panel-enter relative flex min-h-full flex-col overflow-hidden border border-border bg-[#14141b] p-6 sm:p-8 lg:p-9">
      <div
        aria-hidden="true"
        className="absolute -right-5 -top-10 font-display text-[10rem] font-extrabold leading-none text-white/[0.035]"
      >
        {hotspot.index}
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-race-red" aria-hidden="true" />
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 sm:text-[11px]">
            Hotspot {hotspot.index} / 05
          </p>
        </div>

        <h2 className="mt-5 max-w-xs font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.025em] text-white sm:text-6xl">
          {hotspot.title}
        </h2>
      </div>

      <div className="relative mt-10 border-t border-white/12 pt-7">
        <p className="font-display text-lg font-bold uppercase text-white">
          What happens here
        </p>
        <p className="mt-3 text-base leading-6 text-text-secondary">
          {hotspot.whatHappens}
        </p>
      </div>

      <div className="relative mt-8 border-l-2 border-race-red pl-5">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-race-red">
          Watch for this
        </p>
        <p className="mt-3 text-base leading-6 text-white/88">
          {hotspot.whyItMatters}
        </p>
      </div>

      <div className="relative mt-auto pt-10">
        <div className="border-t border-white/12 pt-6">
          {sepangReady ? (
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-race-red">
                Circuit read complete
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                You now know the five places worth recognizing before you make your race calls.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href="/predict">
                  Make Your Picks
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          ) : tourMode === "guided" && hasNextHotspot ? (
            <Button type="button" className="w-full" onClick={onNextHotspot}>
              Next Hotspot
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : (
            <Button asChild variant="secondary" className="w-full">
              <Link href="/predict">
                Make Your Picks
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
