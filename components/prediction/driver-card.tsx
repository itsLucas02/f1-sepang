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
        "group relative min-h-40 cursor-pointer overflow-hidden rounded-[4px] border bg-[#121218] p-5 transition-[transform,border-color,background-color] duration-200 sm:min-h-44 sm:p-6",
        selected
          ? "race-select-pop border-race-red bg-[#1b1519]"
          : "border-border hover:-translate-y-0.5 hover:border-[#6a6a74] hover:bg-[#17171e]",
        disabled && "cursor-not-allowed opacity-35 hover:translate-y-0",
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

      <div
        aria-hidden="true"
        className={cn(
          "absolute -right-10 -top-20 h-52 w-32 rotate-[24deg] transition-colors duration-200",
          selected ? "bg-race-red/10" : "bg-white/[0.025] group-hover:bg-white/[0.045]",
        )}
      />

      <span className="relative z-10 block max-w-[72%] font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted sm:text-[11px]">
        {driver.team}
      </span>

      <div className="relative z-10 mt-9">
        <span className="block text-sm font-semibold leading-none text-text-secondary">
          {driver.firstName}
        </span>
        <span className="mt-1 block font-display text-3xl font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-white sm:text-4xl">
          {driver.surname}
        </span>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-5 right-2 font-display text-[6.5rem] font-extrabold leading-none tracking-[-0.06em] transition-colors sm:text-[7.5rem]",
          selected ? "text-race-red/22" : "text-white/[0.055]",
        )}
      >
        {driver.number}
      </span>

      {selected ? (
        <span className="absolute right-4 top-4 flex size-7 items-center justify-center bg-race-red text-white">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span aria-hidden="true" className="absolute right-5 top-5 size-2 bg-white/20" />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-1 origin-left bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[4px] peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
