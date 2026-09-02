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
        "group relative isolate block min-h-40 cursor-pointer overflow-hidden rounded-lg border p-5 transition-[transform,border-color,background-color,box-shadow] duration-200 sm:min-h-44 sm:p-6",
        selected
          ? "race-select-pop border-race-red bg-[linear-gradient(150deg,#1b0e12_0%,#140f14_55%,#0e1116_100%)] shadow-[0_0_0_1px_rgba(232,17,45,0.35),0_18px_40px_-18px_rgba(232,17,45,0.55)]"
          : "border-white/10 bg-surface-02 hover:-translate-y-1 hover:border-white/25 hover:bg-surface-03 hover:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.9)]",
        disabled &&
          "cursor-not-allowed opacity-35 hover:translate-y-0 hover:border-white/10 hover:bg-surface-02 hover:shadow-none",
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

      {/* angled livery sweep */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-10 -top-20 h-52 w-32 rotate-[24deg] transition-colors duration-300",
          selected
            ? "bg-race-red/25"
            : "bg-white/[0.03] group-hover:bg-sunset/10",
        )}
      />

      <span
        className={cn(
          "relative z-10 block max-w-[72%] font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]",
          selected ? "text-sunset" : "text-text-muted",
        )}
      >
        {driver.team}
      </span>

      <span className="relative z-10 mt-9 block">
        <span
          className={cn(
            "block text-sm font-semibold leading-none",
            selected ? "text-white/70" : "text-text-secondary",
          )}
        >
          {driver.firstName}
        </span>
        <span className="mt-1 block font-display text-3xl font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-white sm:text-4xl">
          {driver.surname}
        </span>
      </span>

      {/* ghost race number */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-5 right-2 font-display text-[6.5rem] font-extrabold leading-none tracking-[-0.06em] transition-colors duration-300 sm:text-[7.5rem]",
          selected ? "text-race-red/35" : "text-white/[0.05]",
        )}
      >
        {driver.number}
      </span>

      {selected ? (
        <span className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-sm bg-race-red text-white shadow-[0_0_16px_rgba(232,17,45,0.6)]">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute right-5 top-5 size-2 rounded-full bg-white/20 transition-colors group-hover:bg-white/45"
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
