"use client";

import { useEffect, useMemo, useRef } from "react";

import { HOTSPOT_ORDER, getHotspot, type HotspotId } from "@/content/sepang";
import { SEPANG_HOTSPOT_PROGRESS } from "@/lib/sepang-geometry";
import {
  SEPANG_HOT_LAP,
  SEPANG_LAP_POINTS,
  SEPANG_SECTOR_COLORS,
  SEPANG_TRACK_BOUNDS,
  pointAtProgress,
  speedColor,
} from "@/lib/sepang-telemetry";
import { sampleAtTime } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

const PADDING = 0.75;
const VIEWBOX = [
  SEPANG_TRACK_BOUNDS.minX - PADDING,
  SEPANG_TRACK_BOUNDS.minZ - PADDING,
  SEPANG_TRACK_BOUNDS.maxX - SEPANG_TRACK_BOUNDS.minX + PADDING * 2,
  SEPANG_TRACK_BOUNDS.maxZ - SEPANG_TRACK_BOUNDS.minZ + PADDING * 2,
].join(" ");

const TRACK_PATH = `${SEPANG_LAP_POINTS.map(
  (point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(3)},${point.z.toFixed(3)}`,
).join(" ")} Z`;

const TRACE_SEGMENTS = 96;

/** Speed-coloured segments of the racing line, cheap enough for SVG. */
const SPEED_SEGMENTS = Array.from({ length: TRACE_SEGMENTS }, (_, segment) => {
  const size = Math.ceil(SEPANG_LAP_POINTS.length / TRACE_SEGMENTS);
  const start = segment * size;
  const slice = SEPANG_LAP_POINTS.slice(start, start + size + 1);
  const points = slice.length > 1 ? slice : [...slice, SEPANG_LAP_POINTS[0]];

  const speeds = SEPANG_HOT_LAP.samples
    .slice(start, start + size + 1)
    .map((sample) => sample.speed);
  const averageSpeed =
    speeds.reduce((total, value) => total + value, 0) / Math.max(1, speeds.length);
  const [r, g, b] = speedColor(
    averageSpeed,
    SEPANG_HOT_LAP.minSpeed,
    SEPANG_HOT_LAP.topSpeed,
  );

  return {
    d: points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(3)},${point.z.toFixed(3)}`)
      .join(" "),
    color: `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`,
  };
});

function markerAngle(progress: number) {
  const ahead = pointAtProgress(progress + 0.004);
  const behind = pointAtProgress(progress - 0.004);
  return (Math.atan2(ahead.z - behind.z, ahead.x - behind.x) * 180) / Math.PI;
}

const SECTOR_TICKS = SEPANG_HOT_LAP.sectorBounds.map((bound, index) => {
  const progress = index === 2 ? 0 : bound;
  const point = pointAtProgress(progress);
  return {
    key: `sector-${index}`,
    x: point.x,
    z: point.z,
    angle: markerAngle(progress),
    color: SEPANG_SECTOR_COLORS[index],
  };
});

const START_POINT = pointAtProgress(0);
const START_ANGLE = markerAngle(0);

type SepangCircuitMapProps = {
  selectedHotspot: HotspotId;
  /** Shared hot-lap clock, so the map car matches the WebGL car exactly. */
  timeRef?: React.RefObject<number>;
  onSelectHotspot?: (hotspot: HotspotId) => void;
  showCar?: boolean;
  className?: string;
  /** Renders the compact version used for inline previews. */
  compact?: boolean;
};

export function SepangCircuitMap({
  selectedHotspot,
  timeRef,
  onSelectHotspot,
  showCar = true,
  className,
  compact = false,
}: SepangCircuitMapProps) {
  const carRef = useRef<SVGGElement>(null);
  const selected = getHotspot(selectedHotspot);

  const hotspotMarkers = useMemo(
    () =>
      HOTSPOT_ORDER.map((id) => {
        const point = pointAtProgress(SEPANG_HOTSPOT_PROGRESS[id]);
        return { id, hotspot: getHotspot(id), x: point.x, z: point.z };
      }),
    [],
  );

  useEffect(() => {
    if (!showCar || !timeRef) {
      return;
    }

    let frame = 0;

    const tick = () => {
      const node = carRef.current;

      if (node) {
        const progress = sampleAtTime(SEPANG_HOT_LAP, timeRef.current).progress;
        const point = pointAtProgress(progress);
        node.setAttribute(
          "transform",
          `translate(${point.x.toFixed(3)} ${point.z.toFixed(3)}) rotate(${markerAngle(progress).toFixed(1)})`,
        );
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showCar, timeRef]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-[#07080a]", className)}>
      <div className="track-topography pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="race-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <svg
        viewBox={VIEWBOX}
        className={cn("h-full w-full", compact ? "p-3" : "p-6 sm:p-9 lg:p-10")}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="sepang-trace-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.05" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* run-off + asphalt */}
        <path d={TRACK_PATH} stroke="#0e1116" strokeWidth="0.46" strokeLinejoin="round" />
        <path
          d={TRACK_PATH}
          stroke="#e9e7e1"
          strokeOpacity="0.42"
          strokeWidth="0.2"
          strokeLinejoin="round"
        />
        <path d={TRACK_PATH} stroke="#191c22" strokeWidth="0.17" strokeLinejoin="round" />

        {/* speed trace */}
        <g filter="url(#sepang-trace-glow)" strokeLinecap="round" strokeWidth="0.05">
          {SPEED_SEGMENTS.map((segment, index) => (
            <path key={index} d={segment.d} stroke={segment.color} strokeOpacity="0.95" />
          ))}
        </g>

        {/* sector boundaries */}
        {SECTOR_TICKS.map((tick) => (
          <g key={tick.key} transform={`translate(${tick.x} ${tick.z}) rotate(${tick.angle})`}>
            <rect
              x="-0.008"
              y="-0.13"
              width="0.016"
              height="0.26"
              fill={tick.color}
              opacity="0.85"
            />
          </g>
        ))}

        {/* start / finish */}
        <g transform={`translate(${START_POINT.x} ${START_POINT.z}) rotate(${START_ANGLE})`}>
          {Array.from({ length: 6 }, (_, index) => (
            <rect
              key={index}
              x="-0.04"
              y={-0.085 + index * 0.028}
              width="0.08"
              height="0.028"
              fill={index % 2 === 0 ? "#f4f3ef" : "#0c0d10"}
            />
          ))}
        </g>

        {/* hotspot markers */}
        {hotspotMarkers.map((marker) => {
          const isSelected = marker.id === selectedHotspot;

          return (
            <g
              key={marker.id}
              transform={`translate(${marker.x} ${marker.z})`}
              className={onSelectHotspot ? "cursor-pointer" : undefined}
              onClick={onSelectHotspot ? () => onSelectHotspot(marker.id) : undefined}
            >
              {isSelected ? (
                <circle r="0.24" fill="none" stroke="#E8112D" strokeWidth="0.02" className="sepang-marker-pulse" />
              ) : null}
              <circle
                r={isSelected ? 0.115 : 0.07}
                fill={isSelected ? "#E8112D" : "#0b0c0f"}
                stroke="#f2f1ed"
                strokeWidth={isSelected ? 0.032 : 0.022}
                style={{ transition: "r 240ms ease, fill 240ms ease" }}
              />
              {!compact ? (
                <text
                  x={0.19}
                  y={-0.14}
                  fill={isSelected ? "#ffffff" : "#9aa3b0"}
                  fontSize={isSelected ? 0.19 : 0.15}
                  fontFamily="var(--font-mono-source), monospace"
                  fontWeight="700"
                  letterSpacing="0.01"
                  style={{ transition: "font-size 240ms ease, fill 240ms ease" }}
                >
                  {marker.hotspot.shortLabel}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* hot lap car */}
        {showCar ? (
          <g ref={carRef} transform={`translate(${START_POINT.x} ${START_POINT.z})`}>
            <circle r="0.16" fill="#E8112D" opacity="0.18" />
            <rect x="-0.075" y="-0.032" width="0.15" height="0.064" rx="0.02" fill="#E8112D" />
            <rect x="0.028" y="-0.02" width="0.06" height="0.04" rx="0.014" fill="#f4f3ef" />
          </g>
        ) : null}
      </svg>

      {!compact ? (
        <div
          key={selectedHotspot}
          className="circuit-detail-swap pointer-events-none absolute bottom-5 left-5 sm:bottom-6 sm:left-7"
        >
          <span className="motorsport-stripe block origin-left scale-75" aria-hidden="true" />
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            Selected section
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold uppercase italic text-white sm:text-4xl">
            {selected.shortLabel}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Backwards-compatible name used by the circuit stage while WebGL loads. */
export const SepangCircuitFallback = SepangCircuitMap;
