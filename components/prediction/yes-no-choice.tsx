import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function YesNoChoice({
  value,
  selected,
  name,
  onSelect,
}: {
  value: boolean;
  selected: boolean;
  name: string;
  onSelect: () => void;
}) {
  const label = value ? "Yes" : "No";
  const inputId = `${name}-${label.toLowerCase()}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "relative flex min-h-32 cursor-pointer items-center justify-between rounded-md border bg-surface-01 p-6 transition-colors duration-200",
        selected
          ? "border-race-red bg-[rgba(225,6,0,0.05)]"
          : "border-border hover:border-text-muted",
      )}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span className="font-display text-4xl font-extrabold uppercase leading-none text-white">
        {label}
      </span>
      {selected ? (
        <span className="flex size-7 items-center justify-center border border-race-red bg-race-red text-white">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : null}
      <span className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
