# SEPANG 56

**Learn F1. Understand Sepang. Make your picks. Beat your friends.**

SEPANG 56 is a beginner-first Formula 1 web experience built around the prospect of Formula 1 returning to Sepang. The MVP keeps the product scope deliberately focused while aiming for a polished motorsport presentation:

1. **Learn** — understand the minimum F1 concepts needed to enjoy a race.
2. **Understand Sepang** — explore the circuit and the places that matter most.
3. **Make predictions** — make eight race picks using what you just learned.
4. **Compete with friends** — compare scores through global and private leaderboards.

This repository is the working source of truth for the Kracked Devs Formula 1 Sepang bounty project.

> SEPANG 56 is an independent fan-made project. It is not affiliated with or endorsed by Formula 1, the FIA, or Sepang International Circuit. Official Formula 1 logos, proprietary fonts, and protected brand assets are not used as application assets.

## Current status

The core public-demo flow is implemented through predictions:

- Phase 0 — Next.js, TypeScript, Tailwind, design tokens, shared shell, and quality tooling
- Phase 1 — responsive landing experience
- Phase 2 — familiarity check, six Learn lessons, local progress, and Race Ready milestone
- Phase 3 — Sepang guided/free explorer, five hotspots, local progress, 2D fallback, and React Three Fiber scene
- Phase 4 — eight-question anonymous prediction flow, local draft persistence, podium validation, and summary/editing
- Phase 5 — Supabase SSR auth and authenticated prediction persistence are implemented but temporarily parked while the public demo is deployed as a static site
- Phase 6 — the derived **hot lap**: a deterministic, physics-lite lap of Sepang
  driving the WebGL circuit scene, the 2D map fallback and the telemetry overlay

### The hot lap

`Understand Sepang` now runs a simulated lap built from the circuit's real
geometry:

- `lib/telemetry.ts` turns the canonical centreline into a speed profile
  (curvature → cornering limit → traction pass → braking pass), then derives
  gear, throttle, braking, sector splits and corner apexes
- `lib/circuit-geometry.ts` builds the track ribbon, kerbing and speed-coloured
  racing line consumed by the React Three Fiber scene
- the overlay shows speed, gear, pedal traces, elapsed time and S1/S2/S3, with
  play/pause, scrub, replay speed and Overview / Onboard / Corner cameras
- the same lap runs on the lightweight SVG map when WebGL is unavailable, and on
  the landing page teaser

Everything is deterministic and unit tested — it is explicitly labelled as
simulated and is never presented as live timing.

### Brand fonts

The type system follows Formula 1's own: **Formula1** for display and numerals,
**Titillium Web** for body copy, IBM Plex Mono for data. The Formula1 faces are
licensed and are not committed here — install your own copies with:

```bash
F1_FONT_SOURCE=/path/to/fonts npm run fonts:install
```

Without them the display face falls back to Barlow Condensed automatically; the
build never depends on the proprietary files. See `public/fonts/README.md`.

Regenerate the track polyline after changing the source geometry:

```bash
npm run generate:track
```

Because the WebGL scene cannot be screenshotted in CI, the same geometry can be
rendered offline — it projects the real meshes through the real camera with
three's math and writes a PNG to `.preview/`:

```bash
npm run preview:scene            # composed overview
npm run preview:scene corner     # hotspot camera
npm run preview:scene chase 0.06 # onboard camera at 6% lap progress
```

The temporary GitHub Pages build is intentionally frontend-only. Landing, Learn, Sepang, Predictions, and Prediction Summary work without a backend and persist browser progress with `localStorage`.

The production backend will be restored later for a VPS-backed Next.js deployment. The parked server-only integration lives under `backend/next/`.

Major product decisions are finalized for Learn, Sepang, Predictions, scoring, leagues/leaderboards, auth, and persistence.

## Development

Requirements:

- Node.js 20.9 or newer
- npm

Run locally:

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Static demo / GitHub Pages

The current demo uses Next.js static export with the repository base path configured automatically in GitHub Actions.

No secrets or environment variables are required for the static demo.

The exported routes are:

```text
/
/learn
/sepang
/predict
/predict/summary
```

Backend-only actions such as Google sign-in, official prediction submission, leagues, and persisted leaderboards are intentionally unavailable in this temporary deployment mode.

## Backend setup for the later VPS deployment

When the project moves to the VPS-backed deployment, restore the runtime files documented in `backend/next/README.md`, disable static export, and configure the values described in `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_PREDICTION_DEADLINE
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is browser-safe. `SUPABASE_SECRET_KEY` is server-only and must never use a `NEXT_PUBLIC_` prefix or be committed to the repository.

The database migration is stored at:

```text
supabase/migrations/202609010001_auth_predictions.sql
```

The planned authenticated prediction handoff is:

```text
Prediction Summary
  → Save Picks
  → Google OAuth if needed
  → /auth/callback
  → same Prediction Summary
  → server validates and persists picks
```

The browser draft survives the OAuth round trip. Official writes are revalidated on the server and rejected at or after the configured prediction deadline.

## Product principle

Every feature must make sense to someone who knows **zero F1**.

If a beginner encounters unexplained jargon, the interface has failed.

## Experience principle

The feature set is deliberately modest. The presentation is not.

SEPANG 56 should feel like an interactive current-generation motorsport experience rather than a generic learning or prediction website. Three.js is part of the approved MVP presentation layer, but its use is constrained by `docs/threejs-experience.md`.

## Web stack

- Next.js and React
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix primitives for accessible interaction behavior
- Three.js, React Three Fiber, and Drei for explicitly approved 3D scenes
- Supabase for the later authenticated predictions, leagues, and leaderboard backend
- static/local content for lessons and Sepang educational content where practical

### UI engineering principle

> **shadcn gives us the behavior. SEPANG 56 gives it the motorsport skin.**

Default shadcn visuals are not the product design. All primitives must use the SEPANG 56 tokens and component rules in `DESIGN.md` and `docs/ui-standardization.md`.

Identity-heavy elements such as the race header, driver cards, prediction shell, timing leaderboard, circuit information panel, starting lights, and Three.js scenes are custom SEPANG 56 components.

## Product and implementation standards

Start with:

- `AGENTS.md`
- `docs/implementation-blueprint.md`
- `DESIGN.md`

Finalized standards include:

- `docs/learn-flow-standard.md`
- `docs/sepang-flow-standard.md`
- `docs/prediction-flow-standard.md`
- `docs/scoring-standard.md`
- `docs/league-leaderboard-standard.md`
- `docs/auth-persistence-standard.md`
- `docs/component-architecture.md`

Responsive and visual standards remain in `DESIGN.md`, `docs/ui-standardization.md`, and the `docs/mobile-*.md` files.

## KISS / YAGNI

Build the MVP that exists, not a hypothetical platform.

Prefer:

- static content over CMS infrastructure
- simple JSON prediction answers over generic question engines
- one configured race deadline over scheduling systems
- one deterministic scoring function over a rules engine
- one membership table over a social platform
- Google OAuth only over multi-provider auth

## Design references

Google Stitch outputs are used as **visual and composition baselines**, not production specifications.

Generated prototypes may contain substituted fonts, inconsistent palettes, fake telemetry, invented navigation, or route-specific styling. Production implementation must normalize those references against the repository design standards rather than reproduce them line-for-line.

## MVP exclusions

The MVP does **not** include AI chat or tutoring, live race telemetry, live timing, weather APIs, race simulators, tyre strategy calculators, live GPS, fantasy systems, social feeds, payments, native apps, an admin CMS, automated race-result ingestion, or league moderation systems.

Decorative prototype labels such as live timing, circuit-open status, countdown timers, coordinates, and fake system telemetry are not product features.

3D/WebGL is not open-ended. It is used only for the explicitly approved experiences in `docs/threejs-experience.md` unless product scope is deliberately changed.
