import * as THREE from "three";

import {
  SEPANG_HOT_LAP,
  SEPANG_LAP_POINTS,
  speedColor,
} from "@/lib/sepang-telemetry";

/**
 * Mesh construction for the WebGL circuit scene.
 *
 * Kept out of the React component so the geometry can be unit tested without a
 * browser or a WebGL context.
 */

/** Visual proportions of the circuit model, in scene units. */
export const TRACK_WIDTH = 0.34;
export const SLAB_HEIGHT = 0.09;
export const APRON_WIDTH = 0.62;
export const EDGE_LINE_WIDTH = 0.022;
export const KERB_WIDTH = 0.06;
export const TRACE_WIDTH = 0.05;
/** Legacy alias kept for the run-off ribbon width. */
export const RUNOFF_WIDTH = APRON_WIDTH;

const POINTS = SEPANG_LAP_POINTS;
const COUNT = POINTS.length;

export function wrapIndex(index: number) {
  return ((index % COUNT) + COUNT) % COUNT;
}

function normalAt(index: number) {
  const previous = POINTS[wrapIndex(index - 1)];
  const next = POINTS[wrapIndex(index + 1)];
  const dx = next.x - previous.x;
  const dz = next.z - previous.z;
  const length = Math.hypot(dx, dz) || 1;
  return { x: -dz / length, z: dx / length };
}

export const TRACK_NORMALS = POINTS.map((_, index) => normalAt(index));

export const TRACK_CURVATURE = SEPANG_HOT_LAP.samples.map(
  (sample) => sample.curvature,
);

const MAX_CURVATURE = Math.max(...TRACK_CURVATURE);

export function positionAtProgress(progress: number, out = new THREE.Vector3()) {
  const wrapped = ((progress % 1) + 1) % 1;
  const exact = wrapped * COUNT;
  const low = Math.floor(exact) % COUNT;
  const high = (low + 1) % COUNT;
  const t = exact - Math.floor(exact);

  return out.set(
    POINTS[low].x + (POINTS[high].x - POINTS[low].x) * t,
    0,
    POINTS[low].z + (POINTS[high].z - POINTS[low].z) * t,
  );
}

export function directionAtProgress(progress: number, out = new THREE.Vector3()) {
  const ahead = positionAtProgress(progress + 0.004, new THREE.Vector3());
  const behind = positionAtProgress(progress - 0.004, new THREE.Vector3());
  return out.copy(ahead).sub(behind).normalize();
}

/** One edge of a strip: how far sideways from the centreline, and how high. */
export type StripEdge = (index: number) => { lateral: number; y: number };

export type StripOptions = {
  left: StripEdge;
  right: StripEdge;
  color?: (index: number) => readonly [number, number, number];
  /** Restrict the strip to a subset of the lap (used for kerbing). */
  include?: (index: number) => boolean;
};

/**
 * Builds a closed strip that follows the circuit. Both edges are described
 * independently, so the same routine produces the asphalt top face, the
 * vertical slab walls, the white edge lines, the kerbs and the racing line.
 */
export function createStrip({ left, right, color, include }: StripOptions) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const vertexFor = (index: number, edge: StripEdge) => {
    const source = wrapIndex(index);
    const point = POINTS[source];
    const normal = TRACK_NORMALS[source];
    const { lateral, y } = edge(source);
    return [point.x + normal.x * lateral, y, point.z + normal.z * lateral] as const;
  };

  const pushPair = (index: number) => {
    const base = positions.length / 3;
    const a = vertexFor(index, left);
    const b = vertexFor(index, right);
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);

    if (color) {
      const [r, g, bl] = color(wrapIndex(index));
      colors.push(r, g, bl, r, g, bl);
    }

    return base;
  };

  if (include) {
    // Discontinuous strip: emit an isolated quad per included segment.
    for (let index = 0; index < COUNT; index += 1) {
      if (!include(index)) {
        continue;
      }

      const base = pushPair(index);
      pushPair(index + 1);
      indices.push(base, base + 1, base + 3, base, base + 3, base + 2);
    }
  } else {
    for (let index = 0; index <= COUNT; index += 1) {
      pushPair(index);
    }

    for (let index = 0; index < COUNT; index += 1) {
      const base = index * 2;
      indices.push(base, base + 1, base + 3, base, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  if (color) {
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3),
    );
  }
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/** Backwards-compatible flat ribbon helper. */
export function createRibbon({
  width,
  y = 0,
  color,
}: {
  width: number | ((index: number) => number);
  y?: number | ((index: number) => number);
  color?: (index: number) => readonly [number, number, number];
}) {
  const halfWidth = (index: number) =>
    (typeof width === "function" ? width(index) : width) / 2;
  const height = (index: number) => (typeof y === "function" ? y(index) : y);

  return createStrip({
    left: (index) => ({ lateral: halfWidth(index), y: height(index) }),
    right: (index) => ({ lateral: -halfWidth(index), y: height(index) }),
    color,
  });
}

/** Ground apron the circuit slab sits on. */
export function createApron() {
  return createRibbon({ width: APRON_WIDTH, y: 0.002 });
}

/** Top asphalt surface of the raised circuit slab. */
export function createAsphalt() {
  return createRibbon({ width: TRACK_WIDTH, y: SLAB_HEIGHT });
}

/** The vertical face of the slab on one side of the track. */
export function createSlabWall(side: 1 | -1) {
  const lateral = (TRACK_WIDTH / 2) * side;

  return createStrip({
    left: () => ({ lateral, y: SLAB_HEIGHT }),
    right: () => ({ lateral, y: 0.004 }),
  });
}

/** Painted white line just inside each edge of the asphalt. */
export function createEdgeLine(side: 1 | -1) {
  const outer = (TRACK_WIDTH / 2 - 0.008) * side;
  const inner = (TRACK_WIDTH / 2 - 0.008 - EDGE_LINE_WIDTH) * side;

  return createStrip({
    left: () => ({ lateral: outer, y: SLAB_HEIGHT + 0.001 }),
    right: () => ({ lateral: inner, y: SLAB_HEIGHT + 0.001 }),
  });
}

/** True where the lap is curved enough to deserve kerbing. */
export function isCorner(index: number) {
  return TRACK_CURVATURE[index] > MAX_CURVATURE * 0.16;
}

/** Red/white kerbing outside the white line, on the corners only. */
export function createKerbs(side: 1 | -1) {
  const inner = (TRACK_WIDTH / 2) * side;
  const outer = (TRACK_WIDTH / 2 + KERB_WIDTH) * side;
  const white = [0.93, 0.92, 0.9] as const;
  const red = [0.91, 0.07, 0.18] as const;

  return createStrip({
    left: () => ({ lateral: inner, y: SLAB_HEIGHT + 0.0005 }),
    right: () => ({ lateral: outer, y: SLAB_HEIGHT + 0.0005 }),
    include: isCorner,
    color: (index) => (Math.floor(index / 3) % 2 === 0 ? red : white),
  });
}

/** Speed-coloured racing line laid on the asphalt. */
export function createSpeedTrace() {
  const minSpeed = SEPANG_HOT_LAP.minSpeed;
  const maxSpeed = SEPANG_HOT_LAP.topSpeed;

  return createRibbon({
    width: TRACE_WIDTH,
    y: SLAB_HEIGHT + 0.003,
    color: (index) =>
      speedColor(SEPANG_HOT_LAP.samples[index].speed, minSpeed, maxSpeed),
  });
}

/** Chequered start/finish texture, generated on the client. */
export function createChequeredTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (context) {
    const squares = 8;
    const step = size / squares;
    for (let row = 0; row < squares; row += 1) {
      for (let column = 0; column < squares; column += 1) {
        context.fillStyle = (row + column) % 2 === 0 ? "#f4f3ef" : "#0c0d10";
        context.fillRect(column * step, row * step, step, step);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Camera pose looking into a specific corner from the outside. */
export function cornerPose(progress: number) {
  const target = positionAtProgress(progress);
  const direction = directionAtProgress(progress);
  const normal = new THREE.Vector3(-direction.z, 0, direction.x);
  const position = target
    .clone()
    .add(normal.multiplyScalar(1.75))
    .add(direction.clone().multiplyScalar(-0.9))
    .add(new THREE.Vector3(0, 2.15, 1.15));

  return { position, target: target.clone() };
}
