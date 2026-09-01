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
  const dashOffset = 1 - SEPANG_HOTSPOT_PROGRESS[selectedHotspot] + 0.037;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_44%,#18181a_0%,#09090b_68%)]">
      <svg
        viewBox={SEPANG_TRACK_VIEWBOX}
        className="h-full w-full p-7 sm:p-10 lg:p-12"
        aria-hidden="true"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(-99.972483,57.371556)">
          <g transform="matrix(0.6831882,0,0,0.6831882,-1707.7889,-493.83516)">
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#000000"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#F2F1ED"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#141416"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#E10600"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.075 0.925"
              strokeDashoffset={dashOffset}
              style={{
                transition:
                  "stroke-dashoffset 760ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </g>
        </g>

        {HOTSPOT_ORDER.map((id) => {
          const [x, y] = SEPANG_HOTSPOT_SVG_POINTS[id];
          const isSelected = id === selectedHotspot;

          return (
            <g key={id}>
              {isSelected ? (
                <circle
                  cx={x}
                  cy={y}
                  r="17"
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="2"
                  className="sepang-marker-pulse"
                />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 7.5 : 3.5}
                fill={isSelected ? "#FFFFFF" : "#F2F1ED"}
                opacity={isSelected ? 1 : 0.62}
                stroke={isSelected ? "#E10600" : "none"}
                strokeWidth={isSelected ? 4 : 0}
                style={{ transition: "r 240ms ease, fill 240ms ease" }}
              />
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-8 bg-race-red" />
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            Focus point
          </p>
        </div>
        <p className="mt-2 font-display text-2xl font-extrabold uppercase text-white sm:text-3xl">
          {selected.shortLabel}
        </p>
      </div>
    </div>
  );
}
