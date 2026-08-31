import { describe, expect, it } from "vitest";

import {
  addVisitedHotspot,
  getNextGuidedHotspot,
  isSepangReady,
  parsePersistedSepangState,
} from "@/lib/sepang";

describe("Sepang progress", () => {
  it("becomes ready only after all five hotspots are visited", () => {
    expect(isSepangReady(["main-straight", "t1", "t4", "t9"])).toBe(false);
    expect(
      isSepangReady(["main-straight", "t1", "t4", "t9", "t15"]),
    ).toBe(true);
  });

  it("does not duplicate visited hotspots", () => {
    expect(addVisitedHotspot(["t1"], "t1")).toEqual(["t1"]);
  });

  it("finds the next unvisited hotspot in guided order", () => {
    expect(getNextGuidedHotspot("t1", ["main-straight", "t1", "t9"])).toBe(
      "t4",
    );
  });
});

describe("stored Sepang state", () => {
  it("falls back safely for invalid stored state", () => {
    expect(parsePersistedSepangState("not-json")).toEqual({
      hasVisitedSepang: false,
      tourMode: "guided",
      selectedHotspot: "main-straight",
      visitedHotspots: [],
    });
  });

  it("filters invalid hotspots and preserves valid state", () => {
    expect(
      parsePersistedSepangState(
        JSON.stringify({
          hasVisitedSepang: true,
          tourMode: "free",
          selectedHotspot: "t15",
          visitedHotspots: ["t1", "t1", "not-a-turn"],
        }),
      ),
    ).toEqual({
      hasVisitedSepang: true,
      tourMode: "free",
      selectedHotspot: "t15",
      visitedHotspots: ["t1"],
    });
  });
});
