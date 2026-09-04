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
    <div className="absolute inset-0 overflow-hidden bg-[#080809] track-topography">
      <div className="race-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <svg
        viewBox={SEPANG_TRACK_VIEWBOX}
        className="h-full w-full p-6 sm:p-9 lg:p-11"
        aria-hidden="true"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(-99.972483,57.371556)">
          <g transform="matrix(0.6831882,0,0,0.6831882,-1707.7889,-493.83516)">
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#000000"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#F3F1EC"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.96"
            />
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#171719"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#E10600"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="circuit-intro-glow"
              style={{ filter: "drop-shadow(0 0 8px rgba(225, 6, 0, 0.7))" }}
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="circuit-intro-path"
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
                  "stroke-dashoffset 880ms cubic-bezier(0.22, 1, 0.36, 1)",
                filter: "drop-shadow(0 0 5px rgba(225, 6, 0, 0.38))",
              }}
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray="0.012 0.988"
              strokeDashoffset={dashOffset + 0.027}
              opacity="0.92"
              style={{
                transition:
                  "stroke-dashoffset 880ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </g>
        </g>

        {HOTSPOT_ORDER.map((id) => {
          const [x, y] = SEPANG_HOTSPOT_SVG_POINTS[id];
          const isSelected = id === selectedHotspot;
          const hotspot = getHotspot(id);

          return (
            <g key={id}>
              {isSelected ? (
                <circle
                  cx={x}
                  cy={y}
                  r="17"
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="1.5"
                  className="sepang-marker-pulse"
                />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 8 : 4.25}
                fill={isSelected ? "#E10600" : "#0A0A0B"}
                stroke="#F3F1EC"
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isSelected ? 1 : 0.86}
                style={{ transition: "r 240ms ease, fill 240ms ease" }}
              />
              <text
                x={x + (isSelected ? 12 : 9)}
                y={y - (isSelected ? 10 : 7)}
                fill={isSelected ? "#FFFFFF" : "#B8B7BA"}
                fontSize={isSelected ? 12 : 9}
                fontFamily="monospace"
                fontWeight="700"
                letterSpacing="0.5"
                style={{ transition: "font-size 240ms ease, fill 240ms ease" }}
              >
                {hotspot.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>

      <div key={selectedHotspot} className="circuit-detail-swap pointer-events-none absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
        <span className="motorsport-stripe block scale-75 origin-left" aria-hidden="true" />
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
          Selected section
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold uppercase italic text-white sm:text-4xl">
          {selected.shortLabel}
        </p>
      </div>
    </div>
  );
}
