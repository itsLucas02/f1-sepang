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
        "relative block cursor-pointer rounded-md border bg-surface-01 p-6 transition-colors duration-200",
        selected
          ? "border-race-red"
          : "border-border hover:border-text-muted",
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

      <span className="flex items-start justify-between gap-5">
        <span>
          <span className="block font-display text-2xl font-bold uppercase leading-none text-white">
            {title}
          </span>
          <span className="mt-3 block max-w-sm text-base leading-6 text-text-secondary">
            {description}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center border",
            selected
              ? "border-race-red bg-race-red text-white"
              : "border-border text-transparent",
          )}
        >
          <Check className="size-4" />
        </span>
      </span>

      {selected ? (
        <span className="mt-5 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-race-red">
          Selected
        </span>
      ) : null}

      <span className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas" />
    </label>
  );
}
