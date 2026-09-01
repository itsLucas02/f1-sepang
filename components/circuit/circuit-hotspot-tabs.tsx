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
      className="grid grid-cols-2 overflow-hidden border border-black/12 bg-white sm:grid-cols-5"
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
              "group relative min-h-20 border-b border-r border-black/10 px-4 py-4 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black sm:border-b-0 sm:last:border-r-0",
              selected
                ? "bg-[#111113] text-white"
                : "bg-white text-[#252527] hover:bg-[#ebe9e4]",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.12em]",
                  selected ? "text-race-red" : "text-[#7a7a80]",
                )}
              >
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
                "absolute inset-x-0 bottom-0 h-[3px] origin-left bg-race-red transition-transform duration-300",
                selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
