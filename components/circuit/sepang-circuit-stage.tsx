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
      aria-label={`Stylised Sepang circuit with ${hotspot.title} selected`}
      className="relative min-h-[300px] overflow-hidden rounded-lg border border-border bg-surface-01 sm:min-h-[380px] lg:min-h-[520px]"
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
    </div>
  );
}
