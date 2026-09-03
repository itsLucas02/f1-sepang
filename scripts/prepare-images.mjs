import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const driverSourcePath = path.join(root, "content", "drivers.ts");
const heroSourcePath = path.join(root, "public", "hero-sepang.jpg");
const driverOutDir = path.join(root, "public", "media", "drivers");
const journeyOutDir = path.join(root, "public", "media", "journey");
const heroOutDir = path.join(root, "public", "media", "hero");
const sepangOutDir = path.join(root, "public", "media", "sepang");
const predictionOutDir = path.join(root, "public", "media", "prediction");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await Promise.all([
  mkdir(driverOutDir, { recursive: true }),
  mkdir(journeyOutDir, { recursive: true }),
  mkdir(heroOutDir, { recursive: true }),
  mkdir(sepangOutDir, { recursive: true }),
  mkdir(predictionOutDir, { recursive: true }),
]);

const driverSource = await readFile(driverSourcePath, "utf8");
const matches = [
  ...driverSource.matchAll(/id: "([^"]+)"[\s\S]*?src: "(https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^"]+)"/g),
];

if (matches.length !== 22) {
  throw new Error(`Expected 22 driver image sources, found ${matches.length}`);
}

function commons(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1280`;
}

async function fetchImage(url, width = 1280) {
  const optimizedSourceUrl = new URL(url);
  optimizedSourceUrl.searchParams.set("width", String(width));

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(optimizedSourceUrl, {
      headers: {
        "User-Agent":
          "SEPANG56-asset-pipeline/1.0 (GitHub Pages media optimization)",
      },
      redirect: "follow",
    });

    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Failed to fetch ${optimizedSourceUrl}: ${response.status}`);
    }

    const retryAfter = Number(response.headers.get("retry-after"));
    const delay =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 2500 * 2 ** attempt;

    console.warn(
      `Fetch ${response.status} for ${optimizedSourceUrl}; retrying in ${delay}ms`,
    );
    await sleep(delay);
  }

  throw new Error(`Failed to fetch ${optimizedSourceUrl} after retries`);
}

async function readIfPresent(filePath) {
  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}

const fetchedDrivers = new Map();

for (const [, id, url] of matches) {
  const outputPath = path.join(driverOutDir, `${id}.webp`);
  const existing = await readIfPresent(outputPath);

  if (existing) {
    fetchedDrivers.set(id, existing);
    continue;
  }

  const input = await fetchImage(url, 520);

  await sharp(input)
    .rotate()
    .resize(440, 600, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(outputPath);

  fetchedDrivers.set(id, await readFile(outputPath));
  await sleep(1200);
}

await sharp(heroSourcePath)
  .rotate()
  .resize(1600, 900, {
    fit: "cover",
    position: "centre",
    withoutEnlargement: true,
  })
  .webp({ quality: 78, effort: 5, smartSubsample: true })
  .toFile(path.join(heroOutDir, "hero-sepang.webp"));

const remoteSources = {
  journeyLearn: commons(
    "Sepang International Circuit grandstand square 2016 Malaysian GP.jpg",
  ),
  journeySepang: commons(
    "Sepang International Circuit Grandstand Tower 2016 Malaysian GP.jpg",
  ),
  mainStraight: commons("2016 Malaysian GP opening lap 1.jpg"),
  t1: commons("2016 Malaysian GP opening lap 2.jpg"),
  t4: commons("Romain Grosjean 2016 Malaysia FP3.jpg"),
  t9: commons("2016 Malaysian GP opening lap 3.jpg"),
  t15: commons("Red Bull duo 2016 Malaysia Race.jpg"),
  overview: commons("Kimi Raikkonen and Nico Rosberg 2016 Malaysia Race.jpg"),
  predictionIntro: commons(
    "Red Bull duo and Lewis Hamilton 2016 Malaysia Race.jpg",
  ),
};

const downloaded = new Map();
for (const [name, url] of Object.entries(remoteSources)) {
  downloaded.set(name, await fetchImage(url, name === "predictionIntro" ? 1400 : 1100));
  await sleep(1400);
}

const journeyJobs = [
  ["learn", downloaded.get("journeyLearn"), "centre"],
  ["sepang", downloaded.get("journeySepang"), "centre"],
  ["predict", fetchedDrivers.get("leclerc"), "attention"],
  ["compete", fetchedDrivers.get("norris"), "attention"],
];

for (const [name, input, position] of journeyJobs) {
  if (!input) {
    throw new Error(`Missing journey input for ${name}`);
  }

  await sharp(input)
    .rotate()
    .resize(640, 360, { fit: "cover", position, withoutEnlargement: true })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(path.join(journeyOutDir, `${name}.webp`));
}

for (const [name, sourceKey] of [
  ["main-straight", "mainStraight"],
  ["t1", "t1"],
  ["t4", "t4"],
  ["t9", "t9"],
  ["t15", "t15"],
]) {
  await sharp(downloaded.get(sourceKey))
    .rotate()
    .resize(720, 420, { fit: "cover", position: "attention" })
    .webp({ quality: 74, effort: 5, smartSubsample: true })
    .toFile(path.join(sepangOutDir, `${name}.webp`));
}

await sharp(downloaded.get("overview"))
  .rotate()
  .resize(1200, 720, { fit: "cover", position: "attention" })
  .webp({ quality: 76, effort: 5, smartSubsample: true })
  .toFile(path.join(sepangOutDir, "overview.webp"));

await sharp(downloaded.get("predictionIntro"))
  .rotate()
  .resize(1400, 900, { fit: "cover", position: "attention" })
  .webp({ quality: 78, effort: 5, smartSubsample: true })
  .toFile(path.join(predictionOutDir, "intro.webp"));

const manifest = {
  generatedAt: new Date().toISOString(),
  formats: {
    hero: "webp",
    journey: "webp",
    drivers: "webp",
    sepang: "webp",
    prediction: "webp",
  },
  dimensions: {
    hero: "1600x900 max",
    journey: "640x360",
    drivers: "440x600",
    sepangHotspots: "720x420",
    sepangOverview: "1200x720",
    predictionIntro: "1400x900",
  },
  quality: {
    hero: 78,
    journey: 72,
    drivers: 72,
    sepangHotspots: 74,
    sepangOverview: 76,
    predictionIntro: 78,
  },
  sources: {
    sepangPhotography: "Morio / Wikimedia Commons / CC BY-SA 4.0",
  },
};

await writeFile(
  path.join(root, "public", "media", "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log("Generated optimized SEPANG 56 WebP media set.");
