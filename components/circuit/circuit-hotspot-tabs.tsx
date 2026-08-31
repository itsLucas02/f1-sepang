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
      className="flex gap-2 overflow-x-auto pb-1"
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
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              selected
                ? "border-race-red bg-surface-02 text-white"
                : "border-border bg-surface-01 text-text-secondary hover:border-text-muted hover:text-white",
            )}
          >
            {visited ? (
              <Check aria-label="Visited" className="size-3.5 text-race-red" />
            ) : null}
            {hotspot.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
