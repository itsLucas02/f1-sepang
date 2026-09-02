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
        "group relative isolate flex min-h-40 cursor-pointer items-end justify-between overflow-hidden rounded-lg border p-6 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:min-h-48 sm:p-8",
        selected
          ? "race-select-pop border-race-red bg-[linear-gradient(150deg,#1b0e12_0%,#140f14_55%,#0e1116_100%)] shadow-[0_0_0_1px_rgba(232,17,45,0.35),0_18px_40px_-18px_rgba(232,17,45,0.55)]"
          : "border-white/10 bg-surface-02 hover:-translate-y-1 hover:border-white/25 hover:bg-surface-03 hover:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.9)]",
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
          "absolute -right-7 -top-16 font-display text-[10rem] font-extrabold leading-none transition-colors duration-300 sm:text-[12rem]",
          selected ? "text-race-red/25" : "text-white/[0.05]",
        )}
      >
        {value ? "Y" : "N"}
      </span>

      <span className="relative z-10 font-display text-5xl font-extrabold uppercase leading-none tracking-[-0.03em] text-white sm:text-6xl">
        {label}
      </span>

      {selected ? (
        <span className="relative z-10 flex size-8 items-center justify-center rounded-sm bg-race-red text-white shadow-[0_0_16px_rgba(232,17,45,0.6)]">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="relative z-10 size-2 rounded-full bg-white/20 transition-colors group-hover:bg-white/45"
        />
      )}

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
