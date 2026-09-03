"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";

import textures from "@/components/shared/motorsport-textures.module.css";
import { Button } from "@/components/ui/button";
import type { SepangHotspot } from "@/content/sepang";
import { publicAsset } from "@/lib/assets";
import type { TourMode } from "@/lib/sepang";
import { cn } from "@/lib/utils";

type CircuitInfoPanelProps = {
  hotspot: SepangHotspot;
  tourMode: TourMode;
  sepangReady: boolean;
  hasNextHotspot: boolean;
  onNextHotspot: () => void;
  variant?: "desktop" | "mobile";
};

export function CircuitInfoPanel({
  hotspot,
  tourMode,
  sepangReady,
  hasNextHotspot,
  onNextHotspot,
  variant = "desktop",
}: CircuitInfoPanelProps) {
  const mobile = variant === "mobile";

  return (
    <aside
      className={cn(
        `relative flex flex-col overflow-hidden bg-[#0a0a0c] text-foreground ${textures.carbonPanel}`,
        mobile
          ? "min-h-0"
          : "h-[610px] border border-white/14",
      )}
    >
      <figure className={cn("relative shrink-0 overflow-hidden bg-[#111113]", mobile ? "h-48" : "h-44")}>
        <Image
          src={publicAsset(`/media/sepang/${hotspot.id}.webp`)}
          alt={hotspot.media.alt}
          fill
          loading="lazy"
          sizes={mobile ? "100vw" : "33vw"}
          className="object-cover object-center grayscale-[0.08] contrast-110 transition-opacity duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-black/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-white/72">
            {hotspot.media.context}
          </p>
          <p className="max-w-[46%] text-right font-mono text-[7px] uppercase tracking-[0.06em] text-white/42">
            {hotspot.media.credit}
          </p>
        </div>
        <div className={`${textures.stripeBand} pointer-events-none absolute inset-x-0 top-0 h-1.5`} aria-hidden="true" />
      </figure>

      <div className={cn("flex min-h-0 flex-1 flex-col", mobile ? "p-5 sm:p-6" : "p-5 xl:p-6")}>
        <div className="shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={textures.stripeFlagSmall} aria-hidden="true" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-race-red">
                Selected / {hotspot.index}
              </p>
            </div>
            <Flag aria-hidden="true" className="size-4 text-white/38" />
          </div>
          <h2 className={cn(
            "mt-2 font-display font-extrabold uppercase italic leading-[0.84] tracking-[-0.035em] text-white",
            mobile ? "text-4xl sm:text-5xl" : "text-[2.75rem] xl:text-[3.1rem]",
          )}>
            {hotspot.title}
          </h2>
        </div>

        <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
          <p className="text-sm leading-6 text-white/68 xl:text-[15px] xl:leading-6">
            {hotspot.whatHappens}
          </p>
        </div>

        <div className={`mt-4 shrink-0 border border-white/12 bg-[#0d0d0f] p-4 ${textures.rubberGrain}`}>
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-race-red">
            Why it matters
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-white/72">
            {hotspot.whyItMatters}
          </p>
        </div>

        <div className="mt-3 shrink-0 border-l-2 border-race-red bg-white/[0.025] px-3 py-2.5">
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/38">
            Watch for
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.035em] text-white/78">
            {hotspot.watchFor}
          </p>
        </div>

        <div className="mt-auto shrink-0 border-t border-white/10 pt-4">
          <p className="mb-3 font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-white/38">
            {sepangReady
              ? "Circuit read complete"
              : tourMode === "guided" && hasNextHotspot
                ? "Guided tour / next section"
                : "Explore freely"}
          </p>

          {sepangReady ? (
            <Button asChild className="sheen w-full rounded-none uppercase tracking-[0.05em]">
              <Link href="/predict">
                Make Your Picks
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
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
