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
        "group relative isolate flex min-h-44 cursor-pointer items-end justify-between overflow-hidden border p-6 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:min-h-56 sm:p-8",
        selected
          ? "race-select-pop border-race-red bg-[#111113] shadow-[0_18px_40px_rgba(0,0,0,0.42)]"
          : "border-white/14 bg-[#0d0d0f] hover:-translate-y-1 hover:border-white/35 hover:bg-[#141416] hover:shadow-[0_18px_36px_rgba(0,0,0,0.38)]",
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
          "absolute -right-7 -top-16 font-display text-[10rem] font-extrabold italic leading-none transition-colors duration-300 sm:text-[12rem]",
          selected ? "text-race-red/20" : "text-white/[0.035]",
        )}
      >
        {value ? "Y" : "N"}
      </span>

      <div className="relative z-10">
        <span className="motorsport-stripe mb-5 block scale-75 origin-left" aria-hidden="true" />
        <span className="font-display text-5xl font-extrabold uppercase italic leading-none tracking-[-0.03em] text-white sm:text-6xl">
          {label}
        </span>
      </div>

      {selected ? (
        <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-race-red text-white">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span aria-hidden="true" className="relative z-10 size-7 rounded-full border border-white/50" />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px] origin-left bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
