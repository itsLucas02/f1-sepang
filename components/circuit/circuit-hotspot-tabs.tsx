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
      className="grid grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-surface-01 sm:grid-cols-5"
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
              "group relative min-h-20 border-b border-r border-white/8 px-4 py-4 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal sm:border-b-0 sm:last:border-r-0",
              selected
                ? "bg-surface-03 text-white"
                : "bg-transparent text-text-secondary hover:bg-white/[0.05] hover:text-white",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.12em]",
                  selected ? "text-race-red" : "text-text-muted",
                )}
              >
                {hotspot.index}
              </span>
              {visited ? (
                <Check aria-label="Visited" className="size-3.5 text-teal" />
              ) : null}
            </span>
            <span className="mt-3 block font-display text-lg font-bold uppercase leading-none sm:text-xl">
              {hotspot.shortLabel}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] transition-transform duration-300",
                selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
