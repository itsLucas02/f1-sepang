import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const driverSourcePath = path.join(root, "content", "drivers.ts");
const heroSourcePath = path.join(root, "public", "hero-sepang.jpg");
const driverOutDir = path.join(root, "public", "media", "drivers");
const journeyOutDir = path.join(root, "public", "media", "journey");
const heroOutDir = path.join(root, "public", "media", "hero");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const optimizedSourceUrl = url.replace(/\?width=900$/, "?width=520");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(optimizedSourceUrl, {
      headers: { "User-Agent": "SEPANG56-asset-pipeline/1.0 (GitHub Pages media optimization)" },
      redirect: "follow",
    });

    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Failed to fetch ${optimizedSourceUrl}: ${response.status}`);
    }

    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 2500 * 2 ** attempt;

    console.warn(`Fetch ${response.status} for ${optimizedSourceUrl}; retrying in ${delay}ms`);
    await sleep(delay);
  }

  throw new Error(`Failed to fetch ${optimizedSourceUrl} after retries`);
}

for (const [, id, url] of matches) {
  const input = await fetchImage(url);
  fetched.set(id, input);

  await sharp(input)
    .rotate()
    .resize(440, 600, { fit: "cover", position: "attention", withoutEnlargement: true })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(path.join(driverOutDir, `${id}.webp`));

  await sleep(1200);
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
