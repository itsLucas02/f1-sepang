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
    <aside className="border border-border bg-surface-01 p-6 sm:p-8 lg:min-h-full">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
        {hotspot.index} / Circuit
      </p>

      <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.95] text-white sm:text-5xl">
        {hotspot.title}
      </h2>

      <div className="mt-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
          What happens here?
        </p>
        <p className="mt-3 text-base leading-6 text-text-secondary">
          {hotspot.whatHappens}
        </p>
      </div>

      <div className="mt-8 border-l-2 border-race-red bg-surface-02 p-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
          Why it matters
        </p>
        <p className="mt-3 text-base leading-6 text-text-secondary">
          {hotspot.whyItMatters}
        </p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        {sepangReady ? (
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
              You know Sepang
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              You know the key places to watch.
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
    </aside>
  );
}
