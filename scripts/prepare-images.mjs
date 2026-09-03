import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const driverSourcePath = path.join(root, "content", "drivers.ts");
const heroSourcePath = path.join(root, "public", "hero-sepang.jpg");
const driverOutDir = path.join(root, "public", "media", "drivers");
const journeyOutDir = path.join(root, "public", "media", "journey");
const heroOutDir = path.join(root, "public", "media", "hero");

await Promise.all([
  mkdir(driverOutDir, { recursive: true }),
  mkdir(journeyOutDir, { recursive: true }),
  mkdir(heroOutDir, { recursive: true }),
]);

const driverSource = await readFile(driverSourcePath, "utf8");
const matches = [
  ...driverSource.matchAll(/id: "([^"]+)"[\s\S]*?src: "(https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^"]+)"/g),
];

if (matches.length !== 22) {
  throw new Error(`Expected 22 driver image sources, found ${matches.length}`);
}

const fetched = new Map();

async function fetchImage(url) {
  const optimizedSourceUrl = url.replace(/\?width=900$/, "?width=640");
  const response = await fetch(optimizedSourceUrl, {
    headers: { "User-Agent": "SEPANG56-asset-pipeline/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${optimizedSourceUrl}: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

for (const [, id, url] of matches) {
  const input = await fetchImage(url);
  fetched.set(id, input);

  await sharp(input)
    .rotate()
    .resize(440, 600, { fit: "cover", position: "attention", withoutEnlargement: true })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(path.join(driverOutDir, `${id}.webp`));
}

await sharp(heroSourcePath)
  .rotate()
  .resize(1600, 900, { fit: "cover", position: "centre", withoutEnlargement: true })
  .webp({ quality: 78, effort: 5, smartSubsample: true })
  .toFile(path.join(heroOutDir, "hero-sepang.webp"));

const journeyJobs = [
  ["learn", await readFile(heroSourcePath), "west"],
  ["sepang", await readFile(heroSourcePath), "centre"],
  ["predict", fetched.get("leclerc"), "attention"],
  ["compete", fetched.get("norris"), "attention"],
];

for (const [name, input, position] of journeyJobs) {
  await sharp(input)
    .rotate()
    .resize(640, 360, { fit: "cover", position, withoutEnlargement: true })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(path.join(journeyOutDir, `${name}.webp`));
}

const manifest = {
  generatedAt: new Date().toISOString(),
  formats: { hero: "webp", journey: "webp", drivers: "webp" },
  dimensions: {
    hero: "1600x900 max",
    journey: "640x360",
    drivers: "440x600",
  },
  quality: { hero: 78, journey: 72, drivers: 72 },
};

await writeFile(
  path.join(root, "public", "media", "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Generated ${matches.length + journeyJobs.length + 1} optimized WebP assets.`);
