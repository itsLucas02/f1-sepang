// Generates lib/sepang-track-points.ts from the canonical CC0 Sepang SVG path.
//
// Source: Wikimedia Commons, Circuit Sepang 1999.svg by AlexJ, CC0 1.0.
// https://commons.wikimedia.org/wiki/File:Circuit_Sepang_1999.svg
//
// The generated polyline is the single source of truth shared by the WebGL
// circuit scene, the 2D fallback map and the derived hot-lap telemetry, so all
// three stay perfectly aligned. Run with: npm run generate:track
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const geometrySource = readFileSync(
  resolve(here, "../lib/sepang-geometry.ts"),
  "utf8",
);

const pathMatch = geometrySource.match(
  /export const SEPANG_TRACK_PATH = `([\s\S]*?)`;/,
);

if (!pathMatch) {
  throw new Error("Could not read SEPANG_TRACK_PATH from lib/sepang-geometry.ts");
}

const SAMPLE_COUNT = 720;
const d = pathMatch[1];

/** Minimal parser for the command set used by the canonical path (m, l, c, z). */
function parsePath(pathData) {
  const tokens = pathData.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const points = [];
  let index = 0;
  let command = "";
  let current = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };

  const nextNumber = () => Number.parseFloat(tokens[index++]);
  const isCommand = (token) => /^[a-zA-Z]$/.test(token);

  const cubicTo = (c1, c2, end) => {
    const segments = 26;
    for (let step = 1; step <= segments; step += 1) {
      const t = step / segments;
      const it = 1 - t;
      points.push({
        x:
          it * it * it * current.x +
          3 * it * it * t * c1.x +
          3 * it * t * t * c2.x +
          t * t * t * end.x,
        y:
          it * it * it * current.y +
          3 * it * it * t * c1.y +
          3 * it * t * t * c2.y +
          t * t * t * end.y,
      });
    }
    current = end;
  };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }

    const relative = command === command.toLowerCase();
    const base = () => (relative ? current : { x: 0, y: 0 });

    switch (command.toLowerCase()) {
      case "m": {
        const x = nextNumber() + base().x;
        const y = nextNumber() + base().y;
        current = { x, y };
        start = current;
        points.push(current);
        command = relative ? "l" : "L";
        break;
      }
      case "l": {
        const x = nextNumber() + base().x;
        const y = nextNumber() + base().y;
        current = { x, y };
        points.push(current);
        break;
      }
      case "c": {
        const origin = base();
        const c1 = { x: nextNumber() + origin.x, y: nextNumber() + origin.y };
        const c2 = { x: nextNumber() + origin.x, y: nextNumber() + origin.y };
        const end = { x: nextNumber() + origin.x, y: nextNumber() + origin.y };
        cubicTo(c1, c2, end);
        break;
      }
      case "z": {
        points.push(start);
        current = start;
        break;
      }
      default:
        throw new Error(`Unsupported path command: ${command}`);
    }
  }

  return points;
}

function resampleClosed(points, count) {
  const loop = [...points];
  const first = loop[0];
  const last = loop.at(-1);

  if (Math.hypot(first.x - last.x, first.y - last.y) > 1e-6) {
    loop.push({ ...first });
  }

  const cumulative = [0];
  for (let i = 1; i < loop.length; i += 1) {
    cumulative.push(
      cumulative[i - 1] +
        Math.hypot(loop[i].x - loop[i - 1].x, loop[i].y - loop[i - 1].y),
    );
  }

  const total = cumulative.at(-1);
  const result = [];
  let cursor = 1;

  for (let i = 0; i < count; i += 1) {
    const target = (i / count) * total;
    while (cursor < cumulative.length - 1 && cumulative[cursor] < target) {
      cursor += 1;
    }

    const segmentLength = cumulative[cursor] - cumulative[cursor - 1];
    const t = segmentLength === 0 ? 0 : (target - cumulative[cursor - 1]) / segmentLength;
    result.push({
      x: loop[cursor - 1].x + (loop[cursor].x - loop[cursor - 1].x) * t,
      y: loop[cursor - 1].y + (loop[cursor].y - loop[cursor - 1].y) * t,
    });
  }

  return result;
}

const raw = parsePath(d);
const resampled = resampleClosed(raw, SAMPLE_COUNT);

const xs = resampled.map((point) => point.x);
const ys = resampled.map((point) => point.y);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
const centerX = (minX + maxX) / 2;
const centerY = (minY + maxY) / 2;
const scale = 10.25 / Math.max(maxX - minX, maxY - minY);

// Scene space: x to the right, z "down" in the standard top-down view, matching
// the source drawing. Do NOT negate y here: in the composed 3D camera view
// world +z reads as screen-down, so negating mirrors the circuit.
const scenePoints = resampled.map((point) => ({
  x: Number(((point.x - centerX) * scale).toFixed(4)),
  z: Number(((point.y - centerY) * scale).toFixed(4)),
}));

const body = scenePoints
  .map((point) => `  [${point.x}, ${point.z}],`)
  .join("\n");

const output = `// GENERATED FILE — do not edit by hand.
// Run \`npm run generate:track\` to regenerate from lib/sepang-geometry.ts.
//
// Canonical Sepang International Circuit centreline, resampled to ${SAMPLE_COUNT}
// evenly spaced points in scene units (x right, z towards camera, lap-direction
// ordered). Source: Wikimedia Commons, Circuit Sepang 1999.svg by AlexJ, CC0 1.0.

export const SEPANG_TRACK_POINTS: readonly (readonly [number, number])[] = [
${body}
];

export const SEPANG_TRACK_SAMPLE_COUNT = ${SAMPLE_COUNT};
`;

writeFileSync(resolve(here, "../lib/sepang-track-points.ts"), output);

console.log(
  `Wrote ${SAMPLE_COUNT} track points (bounds ${(maxX - minX).toFixed(1)} x ${(maxY - minY).toFixed(1)} svg units).`,
);
