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

export const SEPANG_SECTOR_COLORS = ["#FF7A18", "#00E0C6", "#FFB302"] as const;

/** Colour ramp used by the speed trace: slow (red) to flat-out (near white). */
export function speedColor(speedKmh: number, min: number, max: number) {
  const span = Math.max(1, max - min);
  const t = Math.min(1, Math.max(0, (speedKmh - min) / span));

  const stops = [
    { at: 0, rgb: [232, 17, 45] },
    { at: 0.4, rgb: [255, 122, 24] },
    { at: 0.72, rgb: [255, 179, 2] },
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
