"use client";

import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";

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
    <aside className="panel-enter relative flex min-h-full flex-col border border-white/14 bg-[#0a0a0c] p-6 text-foreground sm:p-8 lg:p-9">
      <div className="relative">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">
          Selected section
        </p>
        <h2 className="mt-4 max-w-sm font-display text-5xl font-extrabold uppercase italic leading-[0.82] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.7rem]">
          {hotspot.title}
        </h2>
        <span className="motorsport-stripe mt-5 block scale-75 origin-left" aria-hidden="true" />
      </div>

      <div className="relative mt-8 border-t border-white/10 pt-7">
        <p className="text-base leading-7 text-white/68 sm:text-lg">
          {hotspot.whatHappens}
        </p>
      </div>

      <div className="relative mt-8 border border-white/14 bg-[#0d0d0f] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-race-red">
            Why it matters
          </p>
          <Flag aria-hidden="true" className="size-4 text-white/45" />
        </div>
        <p className="mt-4 text-sm font-medium leading-6 text-white/72 sm:text-base sm:leading-7">
          {hotspot.whyItMatters}
        </p>
      </div>

      <div className="relative mt-auto pt-9">
        <div className="border-t border-white/10 pt-6">
          {sepangReady ? (
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Circuit read complete
              </p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                You now know the five places worth recognizing before you make your race calls.
              </p>
              <Button asChild className="sheen mt-5 w-full rounded-none uppercase tracking-[0.05em]">
                <Link href="/predict">
                  Make Your Picks
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          ) : tourMode === "guided" && hasNextHotspot ? (
            <Button type="button" className="sheen w-full rounded-none uppercase tracking-[0.05em]" onClick={onNextHotspot}>
              Next Hotspot
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : (
            <Button asChild variant="secondary" className="w-full rounded-none border-white/25 uppercase tracking-[0.05em]">
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
