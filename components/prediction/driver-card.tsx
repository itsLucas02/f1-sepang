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
        "group relative min-h-40 cursor-pointer overflow-hidden rounded-[3px] border p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:min-h-44 sm:p-6",
        selected
          ? "race-select-pop border-race-red bg-[#111113] shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
          : "border-black/12 bg-white hover:-translate-y-0.5 hover:border-black/35 hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)]",
        disabled && "cursor-not-allowed opacity-35 hover:translate-y-0 hover:shadow-none",
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
          selected ? "bg-race-red/14" : "bg-black/[0.025] group-hover:bg-race-red/[0.045]",
        )}
      />

      <span
        className={cn(
          "relative z-10 block max-w-[72%] font-mono text-[10px] font-medium uppercase tracking-[0.1em] sm:text-[11px]",
          selected ? "text-white/45" : "text-[#74747a]",
        )}
      >
        {driver.team}
      </span>

      <div className="relative z-10 mt-9">
        <span
          className={cn(
            "block text-sm font-semibold leading-none",
            selected ? "text-white/62" : "text-[#66666c]",
          )}
        >
          {driver.firstName}
        </span>
        <span
          className={cn(
            "mt-1 block font-display text-3xl font-extrabold uppercase leading-[0.88] tracking-[-0.02em] sm:text-4xl",
            selected ? "text-white" : "text-[#111113]",
          )}
        >
          {driver.surname}
        </span>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-5 right-2 font-display text-[6.5rem] font-extrabold leading-none tracking-[-0.06em] transition-colors sm:text-[7.5rem]",
          selected ? "text-race-red/30" : "text-black/[0.055]",
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
        <span aria-hidden="true" className="absolute right-5 top-5 size-2 bg-black/15" />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px] origin-left bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[3px] peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-black" />
    </label>
  );
}
