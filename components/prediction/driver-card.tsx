import { Check } from "lucide-react";

import type { Driver } from "@/content/drivers";
import { cn } from "@/lib/utils";

export function DriverCard({
  driver,
  selected,
  disabled,
  name,
  onSelect,
}: {
  driver: Driver;
  selected: boolean;
  disabled?: boolean;
  name: string;
  onSelect: () => void;
}) {
  const inputId = `${name}-${driver.id}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "relative min-h-28 cursor-pointer overflow-hidden rounded-md border bg-surface-01 p-4 transition-colors duration-200 sm:min-h-32 sm:p-5",
        selected
          ? "border-race-red bg-[rgba(225,6,0,0.05)]"
          : "border-border hover:border-text-muted",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={driver.id}
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="peer sr-only"
      />

      <span className="relative z-10 block font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted sm:text-xs">
        {driver.team}
      </span>
      <span className="relative z-10 mt-3 block font-display text-2xl font-bold uppercase leading-none text-white sm:text-3xl">
        {driver.surname}
      </span>
      <span className="relative z-10 mt-1 block text-sm text-text-secondary">
        {driver.firstName}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-3 right-2 font-display text-6xl font-extrabold leading-none sm:text-7xl",
          selected ? "text-race-red/20" : "text-white/[0.055]",
        )}
      >
        {driver.number}
      </span>

      {selected ? (
        <span className="absolute right-3 top-3 flex size-6 items-center justify-center border border-race-red bg-race-red text-white">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : null}

      <span className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
