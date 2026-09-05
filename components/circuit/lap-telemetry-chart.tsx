"use client";

import { useMemo, useRef, useState } from "react";

import {
  SEPANG_HOT_LAP,
  SEPANG_SECTOR_COLORS,
  speedColor,
} from "@/lib/sepang-telemetry";
import { formatSectorTime, sampleAtProgress } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

const WIDTH = 1000;
const HEIGHT = 260;
const PADDING = { top: 18, right: 14, bottom: 26, left: 40 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

const MAX_SPEED = Math.ceil(SEPANG_HOT_LAP.topSpeed / 50) * 50;
const SPEED_TICKS = [0, 100, 200, 300].filter((tick) => tick <= MAX_SPEED);

function xFor(progress: number) {
  return PADDING.left + progress * PLOT_WIDTH;
}

function yFor(speed: number) {
  return PADDING.top + (1 - speed / MAX_SPEED) * PLOT_HEIGHT;
}

const SPEED_PATH = SEPANG_HOT_LAP.samples
  .map(
    (sample, index) =>
      `${index === 0 ? "M" : "L"}${xFor(sample.progress).toFixed(2)},${yFor(sample.speed).toFixed(2)}`,
  )
  .join(" ");

const AREA_PATH = `${SPEED_PATH} L${xFor(1).toFixed(2)},${yFor(0).toFixed(2)} L${xFor(0).toFixed(2)},${yFor(0).toFixed(2)} Z`;

const THROTTLE_BARS = SEPANG_HOT_LAP.samples.filter((_, index) => index % 3 === 0);

/**
 * Speed-over-distance trace for the simulated hot lap: the classic F1 broadcast
 * telemetry graphic, drawn from the same derived lap as the 3D scene.
 */
export function LapTelemetryChart({
  className,
  onScrub,
}: {
  className?: string;
  onScrub?: (progress: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const hoverSample = useMemo(
    () => (hover === null ? null : sampleAtProgress(SEPANG_HOT_LAP, hover)),
    [hover],
  );

  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const bounds = svg.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const progress = Math.min(
      1,
      Math.max(0, (ratio * WIDTH - PADDING.left) / PLOT_WIDTH),
    );
    setHover(progress);
  };

  const sectors = [
    { from: 0, to: SEPANG_HOT_LAP.sectorBounds[0] },
    { from: SEPANG_HOT_LAP.sectorBounds[0], to: SEPANG_HOT_LAP.sectorBounds[1] },
    { from: SEPANG_HOT_LAP.sectorBounds[1], to: 1 },
  ];

  return (
    <figure className={cn("relative", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none select-none"
        role="img"
        aria-label={`Simulated speed trace for one lap of Sepang. Top speed ${Math.round(SEPANG_HOT_LAP.topSpeed)} kilometres per hour, slowest corner ${Math.round(SEPANG_HOT_LAP.minSpeed)} kilometres per hour.`}
        onPointerMove={handlePointer}
        onPointerLeave={() => setHover(null)}
        onPointerDown={(event) => {
          handlePointer(event);
          if (onScrub && hover !== null) {
            onScrub(hover);
          }
        }}
      >
        <defs>
          <linearGradient id="speed-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8112D" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#E8112D" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#E8112D" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* sector bands */}
        {sectors.map((sector, index) => (
          <rect
            key={index}
            x={xFor(sector.from)}
            y={PADDING.top}
            width={(sector.to - sector.from) * PLOT_WIDTH}
            height={PLOT_HEIGHT}
            fill={SEPANG_SECTOR_COLORS[index]}
            opacity={0.05}
          />
        ))}

        {/* speed gridlines */}
        {SPEED_TICKS.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray={tick === 0 ? undefined : "3 6"}
            />
            <text
              x={PADDING.left - 8}
              y={yFor(tick) + 4}
              textAnchor="end"
              className="fill-white/35 font-mono"
              fontSize="11"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* throttle / brake strip */}
        {THROTTLE_BARS.map((sample, index) => {
          const height = 8;
          const y = HEIGHT - PADDING.bottom + 6;
          const width = (PLOT_WIDTH / THROTTLE_BARS.length) * 1.05;
          const braking = sample.brake > 0.05;

          return (
            <rect
              key={index}
              x={xFor(sample.progress)}
              y={y}
              width={width}
              height={height}
              fill={braking ? "#E8112D" : "#00D26A"}
              opacity={braking ? 0.85 : 0.2 + sample.throttle * 0.6}
            />
          );
        })}

        <path d={AREA_PATH} fill="url(#speed-area)" />
        <path
          d={SPEED_PATH}
          fill="none"
          stroke="#F5F6F8"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* corner markers */}
        {SEPANG_HOT_LAP.corners.map((corner) => (
          <g key={corner.number}>
            <line
              x1={xFor(corner.progress)}
              x2={xFor(corner.progress)}
              y1={yFor(corner.apexSpeed) - 6}
              y2={PADDING.top}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <circle
              cx={xFor(corner.progress)}
              cy={yFor(corner.apexSpeed)}
              r="3"
              fill={`rgb(${speedColor(corner.apexSpeed, SEPANG_HOT_LAP.minSpeed, SEPANG_HOT_LAP.topSpeed)
                .map((channel) => Math.round(channel * 255))
                .join(" ")})`}
            />
          </g>
        ))}

        {/* hover crosshair */}
        {hoverSample ? (
          <g>
            <line
              x1={xFor(hoverSample.progress)}
              x2={xFor(hoverSample.progress)}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              stroke="#F6F6F0"
              strokeWidth="1"
            />
            <circle
              cx={xFor(hoverSample.progress)}
              cy={yFor(hoverSample.speed)}
              r="4.5"
              fill="#F6F6F0"
            />
          </g>
        ) : null}

        {/* sector labels */}
        {sectors.map((sector, index) => (
          <text
            key={`label-${index}`}
            x={xFor((sector.from + sector.to) / 2)}
            y={HEIGHT - 4}
            textAnchor="middle"
            className="fill-white/40 font-mono"
            fontSize="10"
            letterSpacing="1.4"
          >
            {`S${index + 1} · ${formatSectorTime(
              index === 0
                ? SEPANG_HOT_LAP.sectorTimes[0]
                : SEPANG_HOT_LAP.sectorTimes[index] - SEPANG_HOT_LAP.sectorTimes[index - 1],
            )}`}
          </text>
        ))}
      </svg>

      {hoverSample ? (
        <div
          className="glass-panel pointer-events-none absolute top-3 hidden -translate-x-1/2 px-3 py-2 sm:block"
          style={{ left: `${(xFor(hoverSample.progress) / WIDTH) * 100}%` }}
        >
          <p className="font-display text-xl font-extrabold italic leading-none text-white tabular-nums">
            {Math.round(hoverSample.speed)}
            <span className="ml-1 font-mono text-[9px] not-italic text-white/45">km/h</span>
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">
            {Math.round(hoverSample.distance)} m · gear {hoverSample.gear}
          </p>
        </div>
      ) : null}

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-5 bg-white" aria-hidden="true" />
          Speed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-timing-green" aria-hidden="true" />
          Throttle
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-race-red" aria-hidden="true" />
          Braking
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-timing-purple" aria-hidden="true" />
          Quickest sector
        </span>
        <span>Derived from circuit geometry — not live timing data</span>
      </figcaption>
    </figure>
  );
}
