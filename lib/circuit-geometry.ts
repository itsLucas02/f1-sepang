import * as THREE from "three";

import { SEPANG_HOT_LAP, SEPANG_LAP_POINTS } from "@/lib/sepang-telemetry";

/**
 * Mesh construction for the WebGL circuit scene.
 *
 * Kept out of the React component so the geometry can be unit tested without a
 * browser or a WebGL context.
 */

export const TRACK_WIDTH = 0.17;
export const RUNOFF_WIDTH = 0.46;
export const TRACE_WIDTH = 0.05;

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

export type RibbonOptions = {
  width: number | ((index: number) => number);
  y?: number | ((index: number) => number);
  color?: (index: number) => readonly [number, number, number];
};

/** Builds a closed ribbon (triangle strip) that follows the circuit. */
export function createRibbon({ width, y = 0, color }: RibbonOptions) {
  const vertexCount = (COUNT + 1) * 2;
  const positions = new Float32Array(vertexCount * 3);
  const colors = color ? new Float32Array(vertexCount * 3) : null;

  for (let index = 0; index <= COUNT; index += 1) {
    const source = wrapIndex(index);
    const point = POINTS[source];
    const normal = TRACK_NORMALS[source];
    const halfWidth = (typeof width === "function" ? width(source) : width) / 2;
    const height = typeof y === "function" ? y(source) : y;
    const offset = index * 6;

    positions[offset] = point.x + normal.x * halfWidth;
    positions[offset + 1] = height;
    positions[offset + 2] = point.z + normal.z * halfWidth;
    positions[offset + 3] = point.x - normal.x * halfWidth;
    positions[offset + 4] = height;
    positions[offset + 5] = point.z - normal.z * halfWidth;

    if (colors && color) {
      const [r, g, b] = color(source);
      colors[offset] = r;
      colors[offset + 1] = g;
      colors[offset + 2] = b;
      colors[offset + 3] = r;
      colors[offset + 4] = g;
      colors[offset + 5] = b;
    }
  }

  const indices = new Uint32Array(COUNT * 6);
  for (let index = 0; index < COUNT; index += 1) {
    const base = index * 2;
    const offset = index * 6;
    indices[offset] = base;
    indices[offset + 1] = base + 1;
    indices[offset + 2] = base + 3;
    indices[offset + 3] = base;
    indices[offset + 4] = base + 3;
    indices[offset + 5] = base + 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  if (colors) {
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

/** Red/white kerbing on the inside and outside of the corners. */
export function createKerbs() {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const curvature = SEPANG_HOT_LAP.samples.map((sample) => sample.curvature);
  const maxCurvature = Math.max(...curvature);

  const white = [0.95, 0.94, 0.92] as const;
  const red = [0.91, 0.07, 0.18] as const;

  const pushQuad = (
    points: readonly (readonly [number, number, number])[],
    tint: readonly [number, number, number],
  ) => {
    const base = positions.length / 3;
    for (const [x, y, z] of points) {
      positions.push(x, y, z);
      colors.push(tint[0], tint[1], tint[2]);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };

  for (let index = 0; index < COUNT; index += 1) {
    if (curvature[index] < maxCurvature * 0.22) {
      continue;
    }

    const next = wrapIndex(index + 1);
    const tint = Math.floor(index / 4) % 2 === 0 ? red : white;
    const inner = TRACK_WIDTH / 2;
    const outer = inner + 0.035;
    const p0 = POINTS[index];
    const p1 = POINTS[next];
    const n0 = TRACK_NORMALS[index];
    const n1 = TRACK_NORMALS[next];

    for (const side of [1, -1]) {
      pushQuad(
        [
          [p0.x + n0.x * inner * side, 0.004, p0.z + n0.z * inner * side],
          [p0.x + n0.x * outer * side, 0.004, p0.z + n0.z * outer * side],
          [p1.x + n1.x * outer * side, 0.004, p1.z + n1.z * outer * side],
          [p1.x + n1.x * inner * side, 0.004, p1.z + n1.z * inner * side],
        ],
        tint,
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3),
  );
  geometry.setIndex(indices);

  return geometry;
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
    .add(normal.multiplyScalar(0.82))
    .add(direction.clone().multiplyScalar(-0.34))
    .add(new THREE.Vector3(0, 1.02, 0.6));

  return { position, target: target.clone() };
}
