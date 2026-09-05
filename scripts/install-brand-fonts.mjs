// Installs the licensed Formula1 brand typefaces into public/fonts.
//
// The Formula1 faces are proprietary — they are deliberately NOT vendored in
// this repository. Point this script at a directory or base URL you are
// licensed to use, and it will place the files where app/globals.css expects
// them. Without them the site falls back to Barlow Condensed automatically.
//
//   F1_FONT_SOURCE=/path/to/fonts        npm run fonts:install
//   F1_FONT_SOURCE=https://your.cdn/f1   npm run fonts:install
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const TARGET_DIR = resolve("public/fonts");

const FILES = [
  "Formula1-Regular.woff2",
  "Formula1-Regular.woff",
  "Formula1-Bold.woff2",
  "Formula1-Bold.woff",
  "Formula1-Black.woff2",
  "Formula1-Black.woff",
  "Formula1-Wide.woff2",
  "Formula1-Wide.woff",
];

const source = process.env.F1_FONT_SOURCE;

if (!source) {
  console.log(`
Formula1 brand fonts are not bundled with this repository.

  1. Obtain the licensed Formula1 web fonts (Regular, Bold, Black, Wide) in
     woff2 and/or woff format.
  2. Run:

       F1_FONT_SOURCE=/path/to/those/files npm run fonts:install

Until then the site renders in Titillium Web + Barlow Condensed, which is the
documented fallback and needs no action.
`);
  process.exit(0);
}

await mkdir(TARGET_DIR, { recursive: true });

const isRemote = /^https?:\/\//.test(source);
let installed = 0;
const missing = [];

for (const file of FILES) {
  const destination = join(TARGET_DIR, file);

  try {
    if (isRemote) {
      const response = await fetch(`${source.replace(/\/$/, "")}/${file}`);

      if (!response.ok) {
        missing.push(file);
        continue;
      }

      await writeFile(destination, Buffer.from(await response.arrayBuffer()));
    } else {
      const origin = join(resolve(source), file);
      await access(origin);
      await copyFile(origin, destination);
    }

    installed += 1;
    console.log(`  installed ${file}`);
  } catch {
    missing.push(file);
  }
}

console.log(`\n${installed}/${FILES.length} font files installed.`);

if (missing.length > 0) {
  console.log(
    `Not found (the matching @font-face src entries will simply be skipped by the browser):\n  ${missing.join("\n  ")}`,
  );
}
