import Image from "next/image";
import { Check } from "lucide-react";

import type { Driver } from "@/content/drivers";
import { publicAsset } from "@/lib/assets";
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
        "group relative isolate block min-h-[290px] cursor-pointer overflow-hidden border bg-[#0d0d0f] transition-[transform,border-color,box-shadow] duration-250 sm:min-h-[340px] xl:min-h-[390px]",
        selected
          ? "race-select-pop border-race-red shadow-[0_0_0_1px_rgba(225,6,0,0.28),0_20px_45px_rgba(0,0,0,0.48)]"
          : "border-white/18 hover:-translate-y-1 hover:border-white/42 hover:shadow-[0_22px_48px_rgba(0,0,0,0.5)]",
        disabled &&
          "cursor-not-allowed opacity-35 hover:translate-y-0 hover:border-white/18 hover:shadow-none",
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

      <div className="absolute inset-x-0 top-0 h-[72%] overflow-hidden bg-[#151517]">
        <Image
          src={publicAsset(`/media/drivers/${driver.id}.webp`)}
          alt={`${driver.firstName} ${driver.surname}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 17vw"
          className="object-cover object-[50%_24%] grayscale-[0.28] contrast-110 saturate-[0.8] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-[0.12] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-black/8" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/72 to-transparent" aria-hidden="true" />
        {driver.media ? (
          <p className="absolute bottom-3 right-3 max-w-[85%] text-right font-mono text-[7px] uppercase tracking-[0.06em] text-white/30">
            {driver.media.credit}
          </p>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        <p className="font-mono text-[8px] font-medium uppercase tracking-[0.14em] text-white/45 sm:text-[9px]">
          {driver.team}
        </p>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-3xl font-extrabold italic leading-none text-race-red sm:text-4xl">
            {driver.number}
          </span>
          <div className="min-w-0 pb-0.5">
            <span className="block text-[10px] font-semibold leading-none text-white/55 sm:text-xs">
              {driver.firstName}
            </span>
            <span className="mt-1 block truncate font-display text-[1.65rem] font-extrabold uppercase italic leading-[0.9] tracking-[-0.025em] text-white sm:text-3xl xl:text-[2rem]">
              {driver.surname}
            </span>
          </div>
        </div>
      </div>

      {selected ? (
        <span className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full bg-race-red text-white shadow-[0_8px_18px_rgba(0,0,0,0.38)]">
          <Check aria-hidden="true" className="size-4" />
          <span className="sr-only">Selected</span>
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 z-20 size-7 rounded-full border border-white/65 bg-black/20 transition-colors group-hover:bg-white/10"
        />
      )}

      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 h-[3px] origin-left bg-race-red transition-transform duration-300",
          selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
      <span className="pointer-events-none absolute inset-0 peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-white" />
    </label>
  );
}
