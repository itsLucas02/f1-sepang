import { describe, expect, it } from "vitest";

import {
  cornerPose,
  createKerbs,
  createRibbon,
  directionAtProgress,
  positionAtProgress,
  TRACK_NORMALS,
  TRACK_WIDTH,
} from "@/lib/circuit-geometry";
import { SEPANG_HOTSPOT_PROGRESS } from "@/lib/sepang-geometry";
import { SEPANG_LAP_POINTS, SEPANG_TRACK_BOUNDS } from "@/lib/sepang-telemetry";

function attribute(geometry: ReturnType<typeof createRibbon>, name: string) {
  return geometry.getAttribute(name).array as ArrayLike<number>;
}

function hasFiniteValues(values: ArrayLike<number>) {
  for (let index = 0; index < values.length; index += 1) {
    if (!Number.isFinite(values[index])) {
      return false;
    }
  }
  return true;
}

describe("circuit geometry", () => {
  it("keeps the canonical polyline closed and inside the scene bounds", () => {
    expect(SEPANG_LAP_POINTS.length).toBeGreaterThan(600);
    expect(SEPANG_TRACK_BOUNDS.maxX - SEPANG_TRACK_BOUNDS.minX).toBeLessThan(11);
    expect(SEPANG_TRACK_BOUNDS.maxZ - SEPANG_TRACK_BOUNDS.minZ).toBeLessThan(11);
  });

  it("keeps the circuit the right way round", () => {
    // Regression guard: mapping the source SVG's y axis to -z mirrors Sepang,
    // which renders a plausible-looking but wrong circuit. In the corrected
    // mapping the polygon winds with a positive signed area in the (x, z)
    // plane, matching the source drawing's orientation.
    const points = SEPANG_LAP_POINTS;
    let area = 0;

    for (let index = 0; index < points.length; index += 1) {
      const next = points[(index + 1) % points.length];
      area += points[index].x * next.z - next.x * points[index].z;
    }

    expect(area / 2).toBeGreaterThan(40);
  });

  it("puts the guided hotspots in lap order around the circuit", () => {
    // T1 follows the start/finish straight, T15 is the last corner before it.
    expect(SEPANG_HOTSPOT_PROGRESS["main-straight"]).toBeLessThan(
      SEPANG_HOTSPOT_PROGRESS.t1,
    );
    expect(SEPANG_HOTSPOT_PROGRESS.t1).toBeLessThan(SEPANG_HOTSPOT_PROGRESS.t4);
    expect(SEPANG_HOTSPOT_PROGRESS.t4).toBeLessThan(SEPANG_HOTSPOT_PROGRESS.t9);
    expect(SEPANG_HOTSPOT_PROGRESS.t9).toBeLessThan(SEPANG_HOTSPOT_PROGRESS.t15);
  });

  it("produces unit-length track normals", () => {
    for (const normal of TRACK_NORMALS) {
      expect(Math.hypot(normal.x, normal.z)).toBeCloseTo(1, 6);
    }
  });

  it("builds a watertight ribbon with finite vertices", () => {
    const ribbon = createRibbon({ width: TRACK_WIDTH });
    const positions = attribute(ribbon, "position");
    const indices = ribbon.getIndex()!;

    expect(hasFiniteValues(positions)).toBe(true);
    expect(positions.length / 3).toBe((SEPANG_LAP_POINTS.length + 1) * 2);
    expect(indices.count).toBe(SEPANG_LAP_POINTS.length * 6);

    // The closing pair of vertices must coincide with the opening pair.
    const last = positions.length - 6;
    expect(positions[last]).toBeCloseTo(positions[0], 6);
    expect(positions[last + 2]).toBeCloseTo(positions[2], 6);

    ribbon.dispose();
  });

  it("colours the speed trace ribbon per vertex", () => {
    const ribbon = createRibbon({
      width: 0.05,
      color: () => [1, 0.5, 0.25] as const,
    });
    const colors = attribute(ribbon, "color");

    expect(colors.length).toBe(attribute(ribbon, "position").length);
    expect(colors[0]).toBeCloseTo(1);
    expect(colors[1]).toBeCloseTo(0.5);

    ribbon.dispose();
  });

  it("only kerbs the corners, not the straights", () => {
    const kerbs = createKerbs(1);
    const positions = attribute(kerbs, "position");

    expect(hasFiniteValues(positions)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);
    // Kerbing covers part of the lap, never all of it.
    expect(positions.length / 3 / 8).toBeLessThan(SEPANG_LAP_POINTS.length);

    kerbs.dispose();
  });

  it("moves continuously along the lap", () => {
    let previous = positionAtProgress(0).clone();

    for (let step = 1; step <= 200; step += 1) {
      const current = positionAtProgress(step / 200);
      expect(current.distanceTo(previous)).toBeLessThan(0.4);
      previous = current.clone();
    }

    // A full lap returns to the start.
    expect(positionAtProgress(1).distanceTo(positionAtProgress(0))).toBeCloseTo(0, 6);
  });

  it("points the car along the track", () => {
    for (let step = 0; step < 40; step += 1) {
      const direction = directionAtProgress(step / 40);
      expect(direction.length()).toBeCloseTo(1, 5);
      expect(direction.y).toBeCloseTo(0, 6);
    }
  });

  it("places corner cameras above and beside the apex", () => {
    for (const progress of Object.values(SEPANG_HOTSPOT_PROGRESS)) {
      const { position, target } = cornerPose(progress);

      expect(position.y).toBeGreaterThan(1);
      expect(target.y).toBeCloseTo(0, 6);
      expect(position.distanceTo(target)).toBeGreaterThan(1);
      expect(position.distanceTo(target)).toBeLessThan(4);
    }
  });
});
