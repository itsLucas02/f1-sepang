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
        "group relative block min-h-64 cursor-pointer overflow-hidden rounded-[3px] border p-6 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:p-7",
        selected
          ? "race-select-pop border-race-red bg-[#111113] shadow-[0_12px_30px_rgba(0,0,0,0.1)]"
          : "border-black/12 bg-white hover:-translate-y-0.5 hover:border-black/35 hover:shadow-[0_10px_26px_rgba(0,0,0,0.07)]",
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
          selected ? "text-race-red/16" : "text-black/[0.04]",
        )}
      >
        {LEVEL_MARK[level]}
      </span>

      <span className="relative z-10 flex h-full flex-col">
        <span className="flex items-start justify-between gap-5">
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.14em]",
              selected ? "text-white/45" : "text-[#74747a]",
            )}
          >
            Route {LEVEL_MARK[level]}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center border",
              selected
                ? "border-race-red bg-race-red text-white"
                : "border-black/15 text-transparent",
            )}
          >
            <Check className="size-4" />
          </span>
        </span>

        <span
          className={cn(
            "mt-12 block max-w-[85%] font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] sm:text-4xl",
            selected ? "text-white" : "text-[#111113]",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "mt-4 block max-w-sm text-base leading-6",
            selected ? "text-white/62" : "text-[#59595f]",
          )}
        >
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px] bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[3px] peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#f4f3ef]" />
    </label>
  );
}
