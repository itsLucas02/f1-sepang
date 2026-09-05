"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import {
  HotLapControls,
  HotLapGauge,
  HotLapTiming,
} from "@/components/circuit/hot-lap-hud";
import { SepangCircuitMap } from "@/components/circuit/sepang-circuit-fallback";
import { getHotspot, type HotspotId } from "@/content/sepang";
import { SEPANG_HOT_LAP, SEPANG_LAP_STATS } from "@/lib/sepang-telemetry";
import { formatLapTime } from "@/lib/telemetry";
import { useHotLapController } from "@/lib/use-hot-lap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const SepangCircuitScene = dynamic(
  () => import("@/components/circuit/sepang-circuit-scene"),
  { ssr: false },
);

function supportsWebGL() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

type SepangCircuitStageProps = {
  selectedHotspot: HotspotId;
  onSelectHotspot?: (hotspot: HotspotId) => void;
  className?: string;
};

export function SepangCircuitStage({
  selectedHotspot,
  onSelectHotspot,
  className,
}: SepangCircuitStageProps) {
  const reduceMotion = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const controller = useHotLapController(SEPANG_HOT_LAP, {
    autoPlay: true,
    reducedMotion: reduceMotion,
  });
  const hotspot = getHotspot(selectedHotspot);
  const { setCamera } = controller;

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  // Selecting a section pulls the camera down to that corner.
  const [lastHotspot, setLastHotspot] = useState(selectedHotspot);

  useEffect(() => {
    if (selectedHotspot !== lastHotspot) {
      setLastHotspot(selectedHotspot);
      setCamera("corner");
    }
  }, [lastHotspot, selectedHotspot, setCamera]);

  const stats = useMemo(
    () => [
      { value: "5.543", unit: "km", label: "Lap" },
      { value: "15", unit: "", label: "Turns" },
      { value: formatLapTime(SEPANG_LAP_STATS.lapTime), unit: "", label: "Sim lap" },
      { value: String(SEPANG_LAP_STATS.topSpeed), unit: "km/h", label: "Top speed" },
    ],
    [],
  );

  return (
    <div
      className={cn(
        "group/stage relative isolate min-h-[520px] overflow-hidden border border-white/12 bg-[#07080a] shadow-[0_34px_90px_rgba(0,0,0,0.55)] sm:min-h-[600px] lg:min-h-[680px]",
        className,
      )}
    >
      <div
        role="img"
        aria-label={`Sepang International Circuit, ${hotspot.title} selected, with a simulated hot lap`}
        className="absolute inset-0"
      >
        {webgl ? (
          <SepangCircuitScene
            selectedHotspot={selectedHotspot}
            cameraMode={controller.camera}
            timeRef={controller.timeRef}
            playing={controller.playing}
            seekVersion={controller.seekVersion}
            reduceMotion={reduceMotion}
            onSelectHotspot={onSelectHotspot}
          />
        ) : (
          <SepangCircuitMap
            selectedHotspot={selectedHotspot}
            timeRef={controller.timeRef}
            onSelectHotspot={onSelectHotspot}
            showCar={webgl === false}
          />
        )}
      </div>

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="live-dot" aria-hidden="true" />
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 sm:text-[10px]">
              Interactive circuit explorer
            </p>
          </div>
          <p className="mt-1.5 font-display text-2xl font-extrabold uppercase italic leading-none text-white sm:text-[2rem]">
            Sepang International Circuit
          </p>
        </div>

        <dl className="hidden gap-6 text-right lg:flex">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-2xl font-extrabold italic leading-none text-white tabular-nums">
                {stat.value}
                {stat.unit ? (
                  <span className="ml-1 font-mono text-[9px] not-italic text-white/40">
                    {stat.unit}
                  </span>
                ) : null}
              </dd>
              <dt className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* telemetry */}
      <div className="pointer-events-none absolute left-4 top-24 z-20 hidden sm:left-6 sm:top-28 md:block">
        <HotLapTiming controller={controller} />
      </div>

      <div className="pointer-events-none absolute right-4 top-24 z-20 hidden sm:right-6 sm:top-28 md:block">
        <HotLapGauge controller={controller} />
      </div>

      {/* transport */}
      <div className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-5 sm:bottom-5">
        <HotLapControls controller={controller} />
      </div>

      <div
        className="motorsport-corner pointer-events-none absolute right-0 top-0 z-20 h-3 w-28"
        aria-hidden="true"
      />
      <div
        className="kerb-stripe-thin pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] opacity-90"
        aria-hidden="true"
      />
    </div>
  );
}
