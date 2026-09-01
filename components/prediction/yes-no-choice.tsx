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
        "group relative flex min-h-40 cursor-pointer items-end justify-between overflow-hidden rounded-[4px] border bg-[#121218] p-6 transition-[transform,border-color,background-color] duration-200 sm:min-h-48 sm:p-8",
        selected
          ? "race-select-pop border-race-red bg-[#1b1519]"
          : "border-border hover:-translate-y-0.5 hover:border-[#6a6a74] hover:bg-[#17171e]",
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

      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-7 -top-16 font-display text-[10rem] font-extrabold leading-none transition-colors sm:text-[12rem]",
          selected ? "text-race-red/12" : "text-white/[0.035]",
        )}
      >
        {value ? "Y" : "N"}
      </span>

      <span className="relative z-10 font-display text-5xl font-extrabold uppercase leading-none tracking-[-0.03em] text-white sm:text-6xl">
        {label}
      </span>
      {selected ? (
        <span className="relative z-10 flex size-8 items-center justify-center bg-race-red text-white">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span aria-hidden="true" className="relative z-10 size-2 bg-white/25" />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-1 bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[4px] peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
