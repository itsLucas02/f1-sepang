import { Check } from "lucide-react";

import type { KnowledgeLevel } from "@/lib/learn";
import { cn } from "@/lib/utils";

type FamiliarityCardProps = {
  level: KnowledgeLevel;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (level: KnowledgeLevel) => void;
};

const LEVEL_MARK = {
  beginner: "01",
  basics: "02",
  fan: "03",
} as const;

export function FamiliarityCard({
  level,
  title,
  description,
  selected,
  onSelect,
}: FamiliarityCardProps) {
  return (
    <label
      className={cn(
        "group relative block min-h-64 cursor-pointer overflow-hidden rounded-[4px] border bg-[#121218] p-6 transition-[transform,border-color,background-color] duration-200 sm:p-7",
        selected
          ? "race-select-pop border-race-red bg-[#1b1519]"
          : "border-border hover:-translate-y-0.5 hover:border-[#676771] hover:bg-[#17171e]",
      )}
    >
      <input
        type="radio"
        name="knowledge-level"
        value={level}
        checked={selected}
        onChange={() => onSelect(level)}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-7 -right-2 font-display text-[9rem] font-extrabold leading-none tracking-[-0.07em]",
          selected ? "text-race-red/12" : "text-white/[0.035]",
        )}
      >
        {LEVEL_MARK[level]}
      </span>

      <span className="relative z-10 flex h-full flex-col">
        <span className="flex items-start justify-between gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Route {LEVEL_MARK[level]}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center border",
              selected
                ? "border-race-red bg-race-red text-white"
                : "border-white/15 text-transparent",
            )}
          >
            <Check className="size-4" />
          </span>
        </span>

        <span className="mt-12 block max-w-[85%] font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-4xl">
          {title}
        </span>
        <span className="mt-4 block max-w-sm text-base leading-6 text-text-secondary">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-1 bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[4px] peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas" />
    </label>
  );
}
