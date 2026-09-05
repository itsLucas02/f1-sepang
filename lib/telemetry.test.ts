import { describe, expect, it } from "vitest";

import { SEPANG_HOT_LAP } from "@/lib/sepang-telemetry";
import {
  buildHotLap,
  detectCorners,
  formatLapTime,
  formatSectorTime,
  gearForSpeed,
  sampleAtProgress,
  sampleAtTime,
  sectorForProgress,
  type TrackPoint,
} from "@/lib/telemetry";

/** A perfect circle: constant curvature, so constant speed. */
function circle(radiusSceneUnits = 1, count = 240): TrackPoint[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radiusSceneUnits,
      z: Math.sin(angle) * radiusSceneUnits,
    };
  });
}

describe("buildHotLap", () => {
  it("keeps a constant-radius circuit at a constant speed", () => {
    const lap = buildHotLap(circle(), { lapDistance: 2000 });
    const speeds = lap.samples.map((sample) => sample.speed);
    const min = Math.min(...speeds);
    const max = Math.max(...speeds);

    expect(max - min).toBeLessThan(1);
    expect(lap.lapTime).toBeCloseTo(2000 / (max / 3.6), 0);
  });

  it("respects the cornering speed limit implied by lateral grip", () => {
    const lapDistance = 2000;
    const radiusMetres = lapDistance / (Math.PI * 2);
    const lap = buildHotLap(circle(), { lapDistance, lateralGrip: 25.4 });
    const expectedKmh = Math.sqrt(25.4 * radiusMetres) * 3.6;

    expect(lap.samples[0].speed).toBeGreaterThan(expectedKmh * 0.9);
    expect(lap.samples[0].speed).toBeLessThan(expectedKmh * 1.1);
  });

  it("never exceeds the configured top speed", () => {
    const lap = buildHotLap(circle(400), { lapDistance: 8000, topSpeed: 300 });
    expect(Math.max(...lap.samples.map((sample) => sample.speed))).toBeLessThanOrEqual(300.001);
  });

  it("rejects degenerate geometry", () => {
    expect(() => buildHotLap([[0, 0], [1, 1]])).toThrow();
  });
});

describe("Sepang derived lap", () => {
  it("produces a plausible Sepang lap time", () => {
    // The real circuit record is 1:34.080 (Hamilton, 2017).
    expect(SEPANG_HOT_LAP.lapTime).toBeGreaterThan(88);
    expect(SEPANG_HOT_LAP.lapTime).toBeLessThan(102);
  });

  it("covers the full circuit distance", () => {
    expect(SEPANG_HOT_LAP.lapDistance).toBe(5543);
    const last = SEPANG_HOT_LAP.samples.at(-1)!;
    expect(last.progress).toBeGreaterThan(0.99);
  });

  it("has increasing time and distance", () => {
    for (let index = 1; index < SEPANG_HOT_LAP.samples.length; index += 1) {
      expect(SEPANG_HOT_LAP.samples[index].time).toBeGreaterThan(
        SEPANG_HOT_LAP.samples[index - 1].time,
      );
      expect(SEPANG_HOT_LAP.samples[index].distance).toBeGreaterThan(
        SEPANG_HOT_LAP.samples[index - 1].distance,
      );
    }
  });

  it("reaches top speed on the straights and slows for the hairpins", () => {
    expect(SEPANG_HOT_LAP.topSpeed).toBeGreaterThan(300);
    expect(SEPANG_HOT_LAP.minSpeed).toBeLessThan(120);
  });

  it("splits the lap into three sectors that add up to the lap time", () => {
    const [s1, s2, s3] = SEPANG_HOT_LAP.sectorTimes;
    expect(s1).toBeGreaterThan(0);
    expect(s2).toBeGreaterThan(s1);
    expect(s3).toBeCloseTo(SEPANG_HOT_LAP.lapTime, 5);
  });

  it("detects the corner sequence in lap order", () => {
    const corners = SEPANG_HOT_LAP.corners;
    expect(corners.length).toBeGreaterThanOrEqual(10);

    for (let index = 1; index < corners.length; index += 1) {
      expect(corners[index].progress).toBeGreaterThan(corners[index - 1].progress);
      expect(corners[index].number).toBe(corners[index - 1].number + 1);
    }
  });
});

describe("sampling", () => {
  it("wraps around the lap", () => {
    const first = sampleAtTime(SEPANG_HOT_LAP, 0);
    const wrapped = sampleAtTime(SEPANG_HOT_LAP, SEPANG_HOT_LAP.lapTime);

    expect(wrapped.progress).toBeCloseTo(first.progress, 3);
  });

  it("interpolates monotonically along the lap", () => {
    const early = sampleAtTime(SEPANG_HOT_LAP, 10);
    const later = sampleAtTime(SEPANG_HOT_LAP, 40);

    expect(later.progress).toBeGreaterThan(early.progress);
  });

  it("matches progress sampling to the underlying samples", () => {
    const sample = sampleAtProgress(SEPANG_HOT_LAP, 0.5);
    expect(sample.progress).toBeCloseTo(0.5, 5);
    expect(sample.speed).toBeGreaterThan(0);
  });

  it("maps progress onto sectors", () => {
    expect(sectorForProgress(SEPANG_HOT_LAP, 0.1)).toBe(1);
    expect(sectorForProgress(SEPANG_HOT_LAP, 0.5)).toBe(2);
    expect(sectorForProgress(SEPANG_HOT_LAP, 0.9)).toBe(3);
  });
});

describe("helpers", () => {
  it("maps speed to a sensible gear", () => {
    expect(gearForSpeed(40)).toBe(1);
    expect(gearForSpeed(200)).toBe(4);
    expect(gearForSpeed(330)).toBe(8);
  });

  it("formats motorsport timing", () => {
    expect(formatLapTime(94.71)).toBe("1:34.710");
    expect(formatLapTime(Number.NaN)).toBe("--:--.---");
    expect(formatSectorTime(31.4415)).toBe("31.442");
  });

  it("finds no corners on a straight line of samples", () => {
    const flat = Array.from({ length: 40 }, (_, index) => ({
      progress: index / 40,
      distance: index * 10,
      time: index,
      speed: 300,
      curvature: 0,
      gear: 8,
      throttle: 1,
      brake: 0,
    }));

    expect(detectCorners(flat, circle(1, 40))).toHaveLength(0);
  });
});
