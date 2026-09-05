import Image from "next/image";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";

import { teamColor, type Driver } from "@/content/drivers";
import { publicAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function DriverCard({
  driver,
  index,
  selected,
  disabled,
  name,
  onSelect,
}: {
  driver: Driver;
  index: number;
  selected: boolean;
  disabled?: boolean;
  name: string;
  onSelect: () => void;
}) {
  const inputId = `${name}-${driver.id}`;
  const accent = teamColor(driver.team);
  const surnameLength = driver.surname.length;
  const surnameSize =
    surnameLength >= 10
      ? "text-[1.22rem] sm:text-[1.42rem] xl:text-[1.55rem]"
      : surnameLength >= 8
        ? "text-[1.38rem] sm:text-[1.62rem] xl:text-[1.75rem]"
        : "text-[1.55rem] sm:text-[1.8rem] xl:text-[1.95rem]";

  return (
    <div
      className="driver-card-enter min-w-0"
      style={
        {
          "--driver-index": index,
          "--team-accent": accent,
        } as CSSProperties
      }
    >
      <label
        htmlFor={inputId}
        className={cn(
          "group relative isolate block h-full min-h-[290px] cursor-pointer overflow-hidden border bg-[#0b0d11] transition-[transform,border-color,box-shadow] duration-300 sm:min-h-[340px] xl:min-h-[390px]",
          selected
            ? "race-select-pop border-race-red shadow-[0_0_0_1px_rgba(232,17,45,0.3),0_24px_50px_rgba(0,0,0,0.55)]"
            : "border-white/14 hover:-translate-y-1.5 hover:border-white/40 hover:shadow-[0_26px_54px_rgba(0,0,0,0.55)]",
          disabled &&
            "cursor-not-allowed opacity-30 hover:translate-y-0 hover:border-white/14 hover:shadow-none",
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

        {/* team colour wash, revealed on hover / selection */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500",
            selected ? "opacity-100" : "group-hover:opacity-100",
          )}
          style={{
            background: `radial-gradient(120% 70% at 50% 108%, color-mix(in srgb, ${accent} 32%, transparent), transparent 72%)`,
          }}
        />

        <div className="absolute inset-x-0 top-0 h-[72%] overflow-hidden bg-[#12151a]">
          <Image
            src={publicAsset(`/media/drivers/${driver.id}.webp`)}
            alt={`${driver.firstName} ${driver.surname}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 17vw"
            className="object-cover object-[50%_24%] grayscale-[0.4] contrast-110 saturate-[0.75] transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
          <div
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11]/75 to-transparent"
            aria-hidden="true"
          />
          {driver.media ? (
            <p className="absolute bottom-3 right-3 max-w-[85%] text-right font-mono text-[7px] uppercase tracking-[0.06em] text-white/30">
              {driver.media.credit}
            </p>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 pr-5 sm:p-5 sm:pr-6">
          <p className="flex items-center gap-2 font-mono text-[8px] font-medium uppercase tracking-[0.14em] text-white/55 sm:text-[9px]">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-[3px] skew-x-[-14deg]"
              style={{ background: accent }}
            />
            {driver.team}
          </p>
          <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-end gap-2.5">
            <span
              className="font-display text-3xl font-extrabold italic leading-none sm:text-4xl"
              style={{ color: accent }}
            >
              {driver.number}
            </span>
            <div className="min-w-0 pb-0.5 pr-1.5">
              <span className="block text-[10px] font-semibold leading-none text-white/55 sm:text-xs">
                {driver.firstName}
              </span>
              <span
                className={cn(
                  "mt-1 block whitespace-nowrap pr-1 font-display font-extrabold uppercase italic leading-[0.92] tracking-[-0.01em] text-white",
                  surnameSize,
                )}
              >
                {driver.surname}
              </span>
            </div>
          </div>
        </div>

        {selected ? (
          <span className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-full bg-race-red text-white shadow-[0_8px_18px_rgba(0,0,0,0.4)]">
            <Check aria-hidden="true" className="size-4" />
            <span className="sr-only">Selected</span>
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 z-20 size-7 rounded-full border border-white/55 bg-black/25 transition-colors group-hover:border-white group-hover:bg-white/10"
          />
        )}

        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 h-[3px] origin-left transition-transform duration-300",
            selected ? "scale-x-100 bg-race-red" : "scale-x-0 group-hover:scale-x-100",
          )}
          style={selected ? undefined : { background: accent }}
        />
        <span className="pointer-events-none absolute inset-0 z-30 peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-teal" />
      </label>
    </div>
  );
}
