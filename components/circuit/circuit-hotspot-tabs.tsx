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
      className="grid min-w-[680px] grid-cols-5 border-y border-border bg-[#14141b] sm:min-w-0"
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
              "group relative min-h-20 border-r border-border px-4 py-4 text-left transition-colors duration-200 last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white",
              selected
                ? "bg-[#202028] text-white"
                : "text-text-secondary hover:bg-[#191920] hover:text-white",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className={cn(
                "font-mono text-[10px] tracking-[0.12em]",
                selected ? "text-race-red" : "text-text-muted",
              )}>
                {hotspot.index}
              </span>
              {visited ? (
                <Check aria-label="Visited" className="size-3.5 text-race-red" />
              ) : null}
            </span>
            <span className="mt-3 block font-display text-lg font-bold uppercase leading-none sm:text-xl">
              {hotspot.shortLabel}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-1 origin-left bg-race-red transition-transform duration-300",
                selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
