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
        "group relative isolate block min-h-64 cursor-pointer overflow-hidden rounded-lg border p-6 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:p-7",
        selected
          ? "race-select-pop border-race-red bg-[linear-gradient(150deg,#1b0e12_0%,#140f14_55%,#0e1116_100%)] shadow-[0_0_0_1px_rgba(232,17,45,0.35),0_18px_40px_-18px_rgba(232,17,45,0.55)]"
          : "border-white/10 bg-surface-02 hover:-translate-y-1 hover:border-white/25 hover:bg-surface-03 hover:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.9)]",
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
          "absolute -bottom-7 -right-2 font-display text-[9rem] font-extrabold leading-none tracking-[-0.07em] transition-colors duration-300",
          selected ? "text-race-red/30" : "text-white/[0.05]",
        )}
      >
        {LEVEL_MARK[level]}
      </span>

      <span className="relative z-10 flex h-full flex-col">
        <span className="flex items-start justify-between gap-5">
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              selected ? "text-sunset" : "text-text-muted",
            )}
          >
            Route {LEVEL_MARK[level]}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-sm border transition-colors",
              selected
                ? "border-race-red bg-race-red text-white shadow-[0_0_16px_rgba(232,17,45,0.6)]"
                : "border-white/20 text-transparent group-hover:border-white/40",
            )}
          >
            <Check className="size-4" />
          </span>
        </span>

        <span className="mt-12 block max-w-[85%] font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-white sm:text-4xl">
          {title}
        </span>
        <span
          className={cn(
            "mt-4 block max-w-sm text-base leading-6",
            selected ? "text-white/70" : "text-text-secondary",
          )}
        >
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,var(--sepang-race-red),var(--sepang-sunset))] transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-teal" />
    </label>
  );
}
