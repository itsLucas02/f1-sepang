"use client";

import { SepangCircuitFallback } from "@/components/circuit/sepang-circuit-fallback";
import { getHotspot, type HotspotId } from "@/content/sepang";

type SepangCircuitStageProps = {
  selectedHotspot: HotspotId;
};

export function SepangCircuitStage({
  selectedHotspot,
}: SepangCircuitStageProps) {
  const hotspot = getHotspot(selectedHotspot);

  return (
    <div
      role="img"
      aria-label={`Sepang International Circuit with ${hotspot.title} selected`}
      className="relative min-h-[430px] overflow-hidden border border-white/14 bg-[#080809] shadow-[0_28px_75px_rgba(0,0,0,0.48)] sm:min-h-[520px] lg:min-h-[610px]"
    >
      <SepangCircuitFallback selectedHotspot={selectedHotspot} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-5 p-5 sm:p-7">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/42 sm:text-[10px]">
            Interactive circuit explorer
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold uppercase italic text-white sm:text-3xl">
            Sepang International Circuit
          </p>
        </div>
        <div className="hidden gap-7 text-right sm:flex">
          <div>
            <p className="font-display text-3xl font-extrabold italic text-white">5.543</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">KM</p>
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold italic text-white">15</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">Turns</p>
          </div>
        </div>
      </div>

      <div className="motorsport-corner pointer-events-none absolute right-0 top-0 z-20 h-3 w-28" aria-hidden="true" />
      <div className="kerb-stripe-thin pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] opacity-90" />
    </div>
  );
}
