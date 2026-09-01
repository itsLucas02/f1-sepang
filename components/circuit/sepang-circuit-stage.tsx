"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";

import { SepangCircuitFallback } from "@/components/circuit/sepang-circuit-fallback";
import { getHotspot, type HotspotId } from "@/content/sepang";

const DynamicSepangCircuitScene = dynamic(
  () =>
    import("@/components/circuit/sepang-circuit-scene").then(
      (module) => module.SepangCircuitScene,
    ),
  { ssr: false },
);

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type SepangCircuitStageProps = {
  selectedHotspot: HotspotId;
};

export function SepangCircuitStage({
  selectedHotspot,
}: SepangCircuitStageProps) {
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hotspot = getHotspot(selectedHotspot);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = document.createElement("canvas");
    const supportsWebGL = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );

    setCanUseWebGL(supportsWebGL);
    setReduceMotion(motionQuery.matches);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);
    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  return (
    <div
      role="img"
      aria-label={`Sepang International Circuit with ${hotspot.title} selected`}
      className="relative min-h-[390px] overflow-hidden rounded-[4px] border border-white/10 bg-[#09090b] shadow-[0_30px_80px_rgba(0,0,0,0.36)] sm:min-h-[480px] lg:min-h-[620px]"
    >
      <SepangCircuitFallback selectedHotspot={selectedHotspot} />

      {canUseWebGL ? (
        <div className="absolute inset-0">
          <SceneErrorBoundary>
            <DynamicSepangCircuitScene
              selectedHotspot={selectedHotspot}
              reduceMotion={reduceMotion}
            />
          </SceneErrorBoundary>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-5 bg-gradient-to-b from-black/80 via-black/28 to-transparent p-5 pb-16 sm:p-7 sm:pb-20">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/52 sm:text-[11px]">
            Sepang International Circuit
          </p>
          <p className="mt-1 font-display text-2xl font-bold uppercase text-white sm:text-3xl">
            {hotspot.title}
          </p>
        </div>
        <div className="flex gap-5 text-right sm:gap-8">
          <div>
            <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">5.543</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/42">KM</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">15</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/42">Turns</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-race-red" />
    </div>
  );
}
