import { HOTSPOT_ORDER, getHotspot, type HotspotId } from "@/content/sepang";
import {
  SEPANG_HOTSPOT_PROGRESS,
  SEPANG_HOTSPOT_SVG_POINTS,
  SEPANG_TRACK_PATH,
  SEPANG_TRACK_VIEWBOX,
} from "@/lib/sepang-geometry";

type SepangCircuitFallbackProps = {
  selectedHotspot: HotspotId;
};

export function SepangCircuitFallback({
  selectedHotspot,
}: SepangCircuitFallbackProps) {
  const selected = getHotspot(selectedHotspot);
  const dashOffset = 1 - SEPANG_HOTSPOT_PROGRESS[selectedHotspot] + 0.035;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0e0e14]">
      <svg
        viewBox={SEPANG_TRACK_VIEWBOX}
        className="h-full w-full p-5 sm:p-8"
        aria-hidden="true"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="sepang-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#25252d" strokeWidth="0.7" />
          </pattern>
          <filter id="sepang-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <rect x="83" y="6" width="636" height="623" fill="url(#sepang-grid)" opacity="0.36" />

        <g transform="translate(-99.972483,57.371556)">
          <g transform="matrix(0.6831882,0,0,0.6831882,-1707.7889,-493.83516)">
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#000000"
              strokeWidth="25"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.42"
              filter="url(#sepang-soft-shadow)"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#2a2a33"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#666670"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#E10600"
              strokeWidth="21"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.07 0.93"
              strokeDashoffset={dashOffset}
              style={{
                transition:
                  "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </g>
        </g>

        {HOTSPOT_ORDER.map((id) => {
          const [x, y] = SEPANG_HOTSPOT_SVG_POINTS[id];
          const hotspot = getHotspot(id);
          const isSelected = id === selectedHotspot;

          return (
            <g key={id}>
              {isSelected ? (
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="2"
                  className="sepang-marker-pulse"
                />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 9 : 6.5}
                fill={isSelected ? "#E10600" : "#d8d8dd"}
                stroke="#0e0e14"
                strokeWidth="3"
                style={{ transition: "r 240ms ease, fill 240ms ease" }}
              />
              <text
                x={x + 15}
                y={y - 13}
                fill={isSelected ? "#ffffff" : "#8e8e98"}
                fontSize="12"
                fontWeight="700"
                fontFamily="monospace"
                letterSpacing="0.08em"
              >
                {hotspot.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-5 left-5 border-l-2 border-race-red pl-3 sm:bottom-7 sm:left-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
          Selected
        </p>
        <p className="mt-1 font-display text-xl font-bold uppercase text-white sm:text-2xl">
          {selected.title}
        </p>
      </div>
    </div>
  );
}
