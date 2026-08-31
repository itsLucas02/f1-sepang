import { HOTSPOT_ORDER, type HotspotId } from "@/content/sepang";

export const SEPANG_STORAGE_KEY = "sepang56.sepang";

export type TourMode = "guided" | "free";

export type PersistedSepangState = {
  hasVisitedSepang: boolean;
  tourMode: TourMode;
  selectedHotspot: HotspotId;
  visitedHotspots: HotspotId[];
};

export const DEFAULT_SEPANG_STATE: PersistedSepangState = {
  hasVisitedSepang: false,
  tourMode: "guided",
  selectedHotspot: "main-straight",
  visitedHotspots: [],
};

export function isHotspotId(value: unknown): value is HotspotId {
  return typeof value === "string" && HOTSPOT_ORDER.includes(value as HotspotId);
}

export function isTourMode(value: unknown): value is TourMode {
  return value === "guided" || value === "free";
}

export function isSepangReady(visitedHotspots: readonly HotspotId[]) {
  const visited = new Set(visitedHotspots);
  return HOTSPOT_ORDER.every((hotspot) => visited.has(hotspot));
}

export function addVisitedHotspot(
  visitedHotspots: readonly HotspotId[],
  hotspot: HotspotId,
) {
  return visitedHotspots.includes(hotspot)
    ? [...visitedHotspots]
    : [...visitedHotspots, hotspot];
}

export function getNextGuidedHotspot(
  selectedHotspot: HotspotId,
  visitedHotspots: readonly HotspotId[],
) {
  const visited = new Set(visitedHotspots);
  const currentIndex = HOTSPOT_ORDER.indexOf(selectedHotspot);
  const afterCurrent = [
    ...HOTSPOT_ORDER.slice(currentIndex + 1),
    ...HOTSPOT_ORDER.slice(0, currentIndex + 1),
  ];

  return afterCurrent.find((hotspot) => !visited.has(hotspot)) ?? null;
}

export function parsePersistedSepangState(raw: string | null): PersistedSepangState {
  if (!raw) {
    return DEFAULT_SEPANG_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as {
      hasVisitedSepang?: unknown;
      tourMode?: unknown;
      selectedHotspot?: unknown;
      visitedHotspots?: unknown;
    };

    const visitedHotspots = Array.isArray(parsed.visitedHotspots)
      ? Array.from(new Set(parsed.visitedHotspots.filter(isHotspotId)))
      : [];

    return {
      hasVisitedSepang: parsed.hasVisitedSepang === true,
      tourMode: isTourMode(parsed.tourMode) ? parsed.tourMode : "guided",
      selectedHotspot: isHotspotId(parsed.selectedHotspot)
        ? parsed.selectedHotspot
        : "main-straight",
      visitedHotspots,
    };
  } catch {
    return DEFAULT_SEPANG_STATE;
  }
}
