// Offline preview of the WebGL circuit scene.
//
// Projects the real scene geometry through the real camera using three's math
// (no GPU) and rasterises it with sharp, so the 3D composition can be reviewed
// without a browser. Dev tool only — not shipped.
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import * as THREE from "three";

import {
  createApron,
  createAsphalt,
  createEdgeLine,
  createKerbs,
  createSlabWall,
  createSpeedTrace,
  cornerPose,
  directionAtProgress,
  positionAtProgress,
  SLAB_HEIGHT,
} from "../lib/circuit-geometry.ts";
import { SEPANG_HOTSPOT_PROGRESS } from "../lib/sepang-geometry.ts";

const WIDTH = 1100;
const HEIGHT = 660;

const MODE = process.argv[2] ?? "overview";
const CAR_PROGRESS = Number(process.argv[3] ?? 0.05);

function makeCamera() {
  const camera = new THREE.PerspectiveCamera(34, WIDTH / HEIGHT, 0.05, 160);

  if (MODE === "corner") {
    const pose = cornerPose(SEPANG_HOTSPOT_PROGRESS.t15);
    camera.position.copy(pose.position);
    camera.lookAt(pose.target);
  } else if (MODE === "chase") {
    const point = positionAtProgress(CAR_PROGRESS);
    const direction = directionAtProgress(CAR_PROGRESS);
    camera.position
      .copy(point)
      .addScaledVector(direction, -0.62)
      .add(new THREE.Vector3(0, 0.34, 0));
    camera.lookAt(
      point.clone().addScaledVector(direction, 0.5).add(new THREE.Vector3(0, 0.05, 0)),
    );
  } else {
    camera.position.set(0, 13.0, 9.9);
    camera.lookAt(0, 0, 0.35);
  }

  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return camera;
}

const camera = makeCamera();
const polygons = [];

function project(vector) {
  const view = vector.clone().applyMatrix4(camera.matrixWorldInverse);
  const ndc = vector.clone().project(camera);
  return {
    x: (ndc.x * 0.5 + 0.5) * WIDTH,
    y: (-ndc.y * 0.5 + 0.5) * HEIGHT,
    depth: -view.z,
  };
}

function pushQuad(points, fill, opacity = 1) {
  const projected = points.map((point) => project(point));

  if (projected.some((point) => point.depth <= 0.02)) {
    return;
  }

  const averageY = points.reduce((total, point) => total + point.y, 0) / points.length;

  polygons.push({
    // Painter's algorithm needs a height tie-break: quads that sit on top of the
    // slab share almost the same camera depth as the asphalt beneath them.
    depth:
      projected.reduce((total, point) => total + point.depth, 0) / projected.length -
      averageY * 6,
    fill,
    opacity,
    d: projected.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
  });
}

/** Walks an indexed BufferGeometry ribbon and emits its quads. */
function addRibbon(geometry, fill, opacity = 1, colored = false) {
  const position = geometry.getAttribute("position");
  const color = colored ? geometry.getAttribute("color") : null;
  const index = geometry.getIndex();

  for (let i = 0; i < index.count; i += 6) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    const d = index.getX(i + 5);

    const corners = [a, b, c, d].map(
      (vertex) =>
        new THREE.Vector3(
          position.getX(vertex),
          position.getY(vertex),
          position.getZ(vertex),
        ),
    );

    let tint = fill;
    if (color) {
      tint = `rgb(${Math.round(color.getX(a) * 255)} ${Math.round(color.getY(a) * 255)} ${Math.round(color.getZ(a) * 255)})`;
    }

    pushQuad(corners, tint, opacity);
  }
}

// ground grid
for (let i = -20; i <= 20; i += 2) {
  pushQuad(
    [
      new THREE.Vector3(-20, -0.05, i),
      new THREE.Vector3(20, -0.05, i),
      new THREE.Vector3(20, -0.05, i + 0.02),
      new THREE.Vector3(-20, -0.05, i + 0.02),
    ],
    "#171b22",
  );
  pushQuad(
    [
      new THREE.Vector3(i, -0.05, -20),
      new THREE.Vector3(i, -0.05, 20),
      new THREE.Vector3(i + 0.02, -0.05, 20),
      new THREE.Vector3(i + 0.02, -0.05, -20),
    ],
    "#171b22",
  );
}

addRibbon(createApron(), "#0c0f14");
addRibbon(createSlabWall(1), "#0f1218");
addRibbon(createSlabWall(-1), "#0f1218");
addRibbon(createAsphalt(), "#242832");
addRibbon(createEdgeLine(1), "#e9e7e1", 0.72);
addRibbon(createEdgeLine(-1), "#e9e7e1", 0.72);
addRibbon(createKerbs(1), "#ffffff", 1, true);
addRibbon(createKerbs(-1), "#ffffff", 1, true);
addRibbon(createSpeedTrace(), "#ffffff", 0.95, true);

// hotspot markers
for (const progress of Object.values(SEPANG_HOTSPOT_PROGRESS)) {
  const point = positionAtProgress(progress);
  const size = 0.11;
  pushQuad(
    [
      new THREE.Vector3(point.x - size, SLAB_HEIGHT + 0.02, point.z - size),
      new THREE.Vector3(point.x + size, SLAB_HEIGHT + 0.02, point.z - size),
      new THREE.Vector3(point.x + size, SLAB_HEIGHT + 0.02, point.z + size),
      new THREE.Vector3(point.x - size, SLAB_HEIGHT + 0.02, point.z + size),
    ],
    "#E8112D",
  );
}

// car
{
  const point = positionAtProgress(CAR_PROGRESS);
  const direction = directionAtProgress(CAR_PROGRESS);
  const side = new THREE.Vector3(-direction.z, 0, direction.x);
  const half = 0.1;
  const wide = 0.03;

  pushQuad(
    [
      point.clone().addScaledVector(direction, half).addScaledVector(side, wide).setY(SLAB_HEIGHT + 0.03),
      point.clone().addScaledVector(direction, half).addScaledVector(side, -wide).setY(SLAB_HEIGHT + 0.03),
      point.clone().addScaledVector(direction, -half).addScaledVector(side, -wide).setY(SLAB_HEIGHT + 0.03),
      point.clone().addScaledVector(direction, -half).addScaledVector(side, wide).setY(SLAB_HEIGHT + 0.03),
    ],
    "#ffffff",
  );
}

polygons.sort((a, b) => b.depth - a.depth);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
<rect width="100%" height="100%" fill="#07080a"/>
${polygons
  .map(
    (polygon) =>
      `<polygon points="${polygon.d}" fill="${polygon.fill}" fill-opacity="${polygon.opacity}"/>`,
  )
  .join("\n")}
</svg>`;

writeFileSync(`.preview/scene-${MODE}.svg`, svg);
await sharp(Buffer.from(svg)).png().toFile(`.preview/scene-${MODE}.png`);
console.log(`rendered .preview/scene-${MODE}.png with ${polygons.length} polygons`);
