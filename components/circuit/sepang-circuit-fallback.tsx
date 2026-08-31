import type { HotspotId } from "@/content/sepang";

const MARKERS: Record<HotspotId, { x: number; y: number; label: string }> = {
  "main-straight": { x: 487, y: 132, label: "MAIN" },
  t1: { x: 575, y: 181, label: "T1" },
  t4: { x: 408, y: 220, label: "T4" },
  t9: { x: 349, y: 363, label: "T9" },
  t15: { x: 117, y: 309, label: "T15" },
};

type SepangCircuitFallbackProps = {
  selectedHotspot: HotspotId;
};

export function SepangCircuitFallback({
  selectedHotspot,
}: SepangCircuitFallbackProps) {
  return (
    <div className="absolute inset-0 bg-surface-01">
      <svg
        viewBox="0 0 640 480"
        className="h-full w-full p-6 sm:p-10"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M117 309C87 283 82 239 105 207C129 174 171 170 210 190L297 235C335 255 378 250 409 220C442 188 459 143 503 132C548 121 585 145 588 181C591 214 565 238 535 254L476 286C443 304 421 332 427 362C433 390 414 410 389 410C361 410 342 389 349 363L365 311C371 291 354 276 334 283L258 311C229 322 212 342 188 350C159 360 136 340 117 309Z"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-surface-03"
        />
        <path
          d="M117 309C87 283 82 239 105 207C129 174 171 170 210 190L297 235C335 255 378 250 409 220C442 188 459 143 503 132C548 121 585 145 588 181C591 214 565 238 535 254L476 286C443 304 421 332 427 362C433 390 414 410 389 410C361 410 342 389 349 363L365 311C371 291 354 276 334 283L258 311C229 322 212 342 188 350C159 360 136 340 117 309Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/70"
        />

        {Object.entries(MARKERS).map(([id, marker]) => {
          const selected = id === selectedHotspot;

          return (
            <g key={id}>
              <circle
                cx={marker.x}
                cy={marker.y}
                r={selected ? 11 : 8}
                className={selected ? "fill-race-red" : "fill-surface-03"}
                stroke="white"
                strokeOpacity={selected ? 0.9 : 0.45}
                strokeWidth="2"
              />
              <text
                x={marker.x + 14}
                y={marker.y - 12}
                className={selected ? "fill-white" : "fill-text-muted"}
                fontSize="12"
                fontFamily="monospace"
              >
                {marker.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
