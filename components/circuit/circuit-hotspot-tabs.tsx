"use client";

import { Check } from "lucide-react";

import { SEPANG_HOTSPOTS, type HotspotId } from "@/content/sepang";
import { cn } from "@/lib/utils";

type CircuitHotspotTabsProps = {
  selectedHotspot: HotspotId;
  visitedHotspots: readonly HotspotId[];
  onSelect: (hotspot: HotspotId) => void;
};

export function CircuitHotspotTabs({
  selectedHotspot,
  visitedHotspots,
  onSelect,
}: CircuitHotspotTabsProps) {
  return (
    <div
      role="group"
      aria-label="Sepang circuit hotspots"
      className="grid grid-cols-2 border border-white/14 bg-[#09090b] sm:grid-cols-5"
    >
      {SEPANG_HOTSPOTS.map((hotspot) => {
        const selected = hotspot.id === selectedHotspot;
        const visited = visitedHotspots.includes(hotspot.id);

        return (
          <button
            key={hotspot.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(hotspot.id)}
            className={cn(
              "group relative min-h-16 border-b border-r border-white/10 px-4 py-3 text-left transition-[background-color,color,transform] duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:border-b-0 sm:last:border-r-0",
              selected
                ? "race-select-pop bg-race-red text-white"
                : "bg-transparent text-white/58 hover:-translate-y-0.5 hover:bg-white/[0.045] hover:text-white",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className={cn("font-mono text-[8px] tracking-[0.12em]", selected ? "text-white/75" : "text-white/30")}>
                {hotspot.index}
              </span>
              {visited ? (
                <Check aria-label="Visited" className={cn("size-3.5 transition-transform duration-200", selected ? "scale-110 text-white" : "text-white/45")} />
              ) : null}
            </span>
            <span className="mt-2 block font-display text-base font-extrabold uppercase italic leading-none sm:text-lg">
              {hotspot.shortLabel}
            </span>
            {!selected ? (
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-race-red transition-transform duration-300 group-hover:scale-x-100" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
