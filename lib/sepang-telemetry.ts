import { HOTSPOT_ORDER, type HotspotId } from "@/content/sepang";
import { SEPANG_HOTSPOT_PROGRESS } from "@/lib/sepang-geometry";
import { SEPANG_TRACK_POINTS } from "@/lib/sepang-track-points";
import {
  buildHotLap,
  sampleAtProgress,
  type HotLap,
  type TrackPoint,
} from "@/lib/telemetry";

/**
 * The single derived hot lap for Sepang, computed once at module load from the
 * canonical CC0 centreline. Deterministic, so the WebGL scene, the 2D map and
 * the HUD all read the exact same numbers.
 */
export const SEPANG_HOT_LAP: HotLap = buildHotLap(SEPANG_TRACK_POINTS, {
  lapDistance: 5543,
});

export const SEPANG_LAP_POINTS = SEPANG_HOT_LAP.points;

/**
 * Broadcast timing colours: purple for the quickest sector of the lap, green
 * for the next, yellow for the slowest. Sectors are not tinted decoratively —
 * the colour states what the data says, exactly as a timing screen does.
 */
export const TIMING_PURPLE = "#B026FF";
export const TIMING_GREEN = "#00D26A";
export const TIMING_YELLOW = "#FFD800";

function rankSectorColors() {
  const durations = SEPANG_HOT_LAP.sectorTimes.map((time, index) =>
    index === 0 ? time : time - SEPANG_HOT_LAP.sectorTimes[index - 1],
  );
  const order = durations
    .map((duration, index) => ({ duration, index }))
    .sort((a, b) => a.duration - b.duration);

  const colors: string[] = ["", "", ""];
  const ramp = [TIMING_PURPLE, TIMING_GREEN, TIMING_YELLOW];
  order.forEach((entry, rank) => {
    colors[entry.index] = ramp[rank];
  });

  return colors as [string, string, string];
}

export const SEPANG_SECTOR_COLORS = rankSectorColors();

/** Per-sector durations, in seconds. */
export const SEPANG_SECTOR_DURATIONS = SEPANG_HOT_LAP.sectorTimes.map(
  (time, index) =>
    index === 0 ? time : time - SEPANG_HOT_LAP.sectorTimes[index - 1],
) as [number, number, number];

/** Colour ramp for the speed trace: slow (deep red) to flat out (bone). */
export function speedColor(speedKmh: number, min: number, max: number) {
  const span = Math.max(1, max - min);
  const t = Math.min(1, Math.max(0, (speedKmh - min) / span));

  // Deep red through race red to bone. No orange: the ramp should read as heat
  // in the sport's own palette, not as a decorative sunset gradient.
  const stops = [
    { at: 0, rgb: [124, 10, 26] },
    { at: 0.45, rgb: [232, 17, 45] },
    { at: 0.78, rgb: [255, 108, 124] },
    { at: 1, rgb: [246, 246, 240] },
  ];

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let index = 0; index < stops.length - 1; index += 1) {
    if (t >= stops[index].at && t <= stops[index + 1].at) {
      lower = stops[index];
      upper = stops[index + 1];
      break;
    }
  }

  const span2 = upper.at - lower.at || 1;
  const local = (t - lower.at) / span2;

  return [
    (lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * local) / 255,
    (lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * local) / 255,
    (lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * local) / 255,
  ] as const;
}

/** Position on the centreline for a normalised lap progress. */
export function pointAtProgress(progress: number): TrackPoint {
  const points = SEPANG_LAP_POINTS;
  const wrapped = ((progress % 1) + 1) % 1;
  const exact = wrapped * points.length;
  const low = Math.floor(exact) % points.length;
  const next = (low + 1) % points.length;
  const t = exact - Math.floor(exact);

  return {
    x: points[low].x + (points[next].x - points[low].x) * t,
    z: points[low].z + (points[next].z - points[low].z) * t,
  };
}

/** Scene-space position of each guided hotspot. */
export const SEPANG_HOTSPOT_POINTS = Object.fromEntries(
  HOTSPOT_ORDER.map((hotspot) => [
    hotspot,
    pointAtProgress(SEPANG_HOTSPOT_PROGRESS[hotspot]),
  ]),
) as Record<HotspotId, TrackPoint>;

/** Telemetry snapshot at each hotspot, used for the section stat strip. */
export const SEPANG_HOTSPOT_TELEMETRY = Object.fromEntries(
  HOTSPOT_ORDER.map((hotspot) => [
    hotspot,
    sampleAtProgress(SEPANG_HOT_LAP, SEPANG_HOTSPOT_PROGRESS[hotspot]),
  ]),
) as Record<HotspotId, ReturnType<typeof sampleAtProgress>>;

/** Bounding box of the circuit in scene units. */
export const SEPANG_TRACK_BOUNDS = SEPANG_LAP_POINTS.reduce(
  (bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    maxX: Math.max(bounds.maxX, point.x),
    minZ: Math.min(bounds.minZ, point.z),
    maxZ: Math.max(bounds.maxZ, point.z),
  }),
  {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minZ: Number.POSITIVE_INFINITY,
    maxZ: Number.NEGATIVE_INFINITY,
  },
);

/** Lap statistics surfaced in the UI. */
export const SEPANG_LAP_STATS = {
  lapTime: SEPANG_HOT_LAP.lapTime,
  topSpeed: Math.round(SEPANG_HOT_LAP.topSpeed),
  slowestCorner: Math.round(SEPANG_HOT_LAP.minSpeed),
  cornerCount: SEPANG_HOT_LAP.corners.length,
  fullThrottleShare: SEPANG_HOT_LAP.fullThrottleShare,
} as const;
