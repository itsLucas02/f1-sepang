// Offline preview of the WebGL circuit scene.
//
// Projects the real scene geometry through the real camera using three's math
// (no GPU) and rasterises it with sharp, so the 3D composition can be reviewed
// without a browser. Dev tool only — not shipped.
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import * as THREE from "three";

// Some tsx/esbuild versions expose TS modules only through `default` when they
// are imported from an .mjs file, so normalise both shapes.
const load = async (specifier) => {
  const loaded = await import(specifier);
  return loaded.default && !loaded.createStrip && !loaded.SEPANG_HOTSPOT_PROGRESS
    ? loaded.default
    : loaded;
};

const {
  createApron,
  createAsphalt,
  createEdgeLine,
  createKerbs,
  createSlabWall,
  createSpeedTrace,
  createTracksidePosts,
  cornerPose,
  directionAtProgress,
  positionAtProgress,
  SLAB_HEIGHT,
} = await load("../lib/circuit-geometry.ts");
const { SEPANG_HOTSPOT_PROGRESS } = await load("../lib/sepang-geometry.ts");

const WIDTH = 1100;
const HEIGHT = 660;

const MODE = process.argv[2] ?? "overview";
const CAR_PROGRESS = Number(process.argv[3] ?? 0.05);

function makeCamera() {
  const camera = new THREE.PerspectiveCamera(34, WIDTH / HEIGHT, 0.05, 160);

  if (MODE === "corner") {
    camera.fov = 38;
    const pose = cornerPose(SEPANG_HOTSPOT_PROGRESS.t15);
    camera.position.copy(pose.position);
    camera.lookAt(pose.target);
  } else if (MODE === "chase") {
    camera.fov = 62;
    const point = positionAtProgress(CAR_PROGRESS);
    const direction = directionAtProgress(CAR_PROGRESS);
    camera.position
      .copy(point)
      .addScaledVector(direction, -0.34)
      .add(new THREE.Vector3(0, SLAB_HEIGHT + 0.145, 0));
    camera.lookAt(
      point
        .clone()
        .addScaledVector(direction, 1.5)
        .add(new THREE.Vector3(0, SLAB_HEIGHT + 0.05, 0)),
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

// ground plane, approximated as tiles shaded by distance from the circuit
const GROUND = 19;
for (let x = -GROUND; x < GROUND; x += 1) {
  for (let z = -GROUND; z < GROUND; z += 1) {
    const distance = Math.hypot(x + 0.5, z + 0.5) / GROUND;
    const level = Math.max(0, 1 - distance * 1.9);
    const channel = (base, peak) => Math.round(base + (peak - base) * level);
    pushQuad(
      [
        new THREE.Vector3(x, -0.02, z),
        new THREE.Vector3(x + 1, -0.02, z),
        new THREE.Vector3(x + 1, -0.02, z + 1),
        new THREE.Vector3(x, -0.02, z + 1),
      ],
      `rgb(${channel(8, 22)} ${channel(9, 27)} ${channel(12, 35)})`,
    );
  }
}

// faint site grid
for (let i = -GROUND; i <= GROUND; i += 1) {
  pushQuad(
    [
      new THREE.Vector3(-GROUND, -0.015, i),
      new THREE.Vector3(GROUND, -0.015, i),
      new THREE.Vector3(GROUND, -0.015, i + 0.012),
      new THREE.Vector3(-GROUND, -0.015, i + 0.012),
    ],
    "#20262f",
  );
  pushQuad(
    [
      new THREE.Vector3(i, -0.015, -GROUND),
      new THREE.Vector3(i, -0.015, GROUND),
      new THREE.Vector3(i + 0.012, -0.015, GROUND),
      new THREE.Vector3(i + 0.012, -0.015, -GROUND),
    ],
    "#20262f",
  );
}

addRibbon(createApron(), "#1a1f27");
addRibbon(createSlabWall(1), "#0e1218");
addRibbon(createSlabWall(-1), "#0e1218");
addRibbon(createAsphalt(), "#363c47");
addRibbon(createEdgeLine(1), "#eceae4", 0.8);
addRibbon(createEdgeLine(-1), "#eceae4", 0.8);
addRibbon(createKerbs(1), "#ffffff", 1, true);
addRibbon(createKerbs(-1), "#ffffff", 1, true);
addRibbon(createSpeedTrace(), "#ffffff", 0.95, true);

// trackside marker posts
for (const post of createTracksidePosts()) {
  const [x, , z] = post.position;
  const height = 0.17;
  const half = 0.025;
  const sin = Math.sin(-post.rotation);
  const cos = Math.cos(-post.rotation);
  const dx = cos * half;
  const dz = -sin * half;

  pushQuad(
    [
      new THREE.Vector3(x - dx, 0.0, z - dz),
      new THREE.Vector3(x + dx, 0.0, z + dz),
      new THREE.Vector3(x + dx, height, z + dz),
      new THREE.Vector3(x - dx, height, z - dz),
    ],
    post.accent ? "#E8112D" : "#8b95a4",
  );
}

// hotspot markers
for (const progress of Object.values(SEPANG_HOTSPOT_PROGRESS)) {
  const point = positionAtProgress(progress);
  const size = 0.075;
  pushQuad(
    [
      new THREE.Vector3(point.x - size, SLAB_HEIGHT + 0.012, point.z - size),
      new THREE.Vector3(point.x + size, SLAB_HEIGHT + 0.012, point.z - size),
      new THREE.Vector3(point.x + size, SLAB_HEIGHT + 0.012, point.z + size),
      new THREE.Vector3(point.x - size, SLAB_HEIGHT + 0.012, point.z + size),
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
<rect width="100%" height="100%" fill="#08090c"/>
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
