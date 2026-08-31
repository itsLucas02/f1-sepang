# SEPANG 56

**Learn F1. Understand Sepang. Make your picks. Beat your friends.**

SEPANG 56 is a beginner-first Formula 1 web app built around Formula 1's return to Sepang. The MVP is intentionally narrow in product scope but ambitious in presentation:

1. **Learn** — understand the minimum F1 concepts needed to enjoy a race.
2. **Understand Sepang** — explore what makes Sepang interesting and important.
3. **Make predictions** — pick likely race outcomes using what you just learned.
4. **Compete with friends** — join private leagues and compare scores.

This repository is the working source of truth for the Kracked Devs Formula 1 Sepang bounty project.

## Implementation status

**Implementation is underway. Phase 0 (project foundation) has started.**

The repository now contains the Next.js/TypeScript/Tailwind foundation, shadcn/Radix configuration, canonical SEPANG 56 design tokens/fonts, shared shell primitives, and CI quality commands.

Major product decisions are finalized for Learn, Sepang, Predictions, scoring, leagues/leaderboards, auth, and persistence.

Start with:

- `AGENTS.md`
- `docs/implementation-blueprint.md`
- `DESIGN.md`

Then follow the dedicated flow/behavior standards under `docs/`.

Do not reopen finalized product decisions during coding unless a real implementation constraint requires product-owner review.

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

## Product principle

Every feature must make sense to someone who knows **zero F1**.

If a beginner encounters unexplained jargon, the interface has failed.

## Experience principle

The feature set is deliberately modest. The presentation is not.

SEPANG 56 should feel like an interactive current-generation motorsport experience rather than a generic learning/prediction website. Three.js is part of the planned MVP experience layer, but its use is predetermined in `docs/threejs-experience.md`; coding agents should not invent additional 3D features.

## Planned web stack

- Next.js / React component architecture
- TypeScript
- Tailwind CSS
- **shadcn/ui + Radix primitives for accessible interaction behavior**
- Three.js + React Three Fiber / Drei for explicitly approved 3D scenes
- Motion/Framer Motion for ordinary non-3D UI transitions; add GSAP only if a specific approved cinematic interaction requires it
- Supabase for auth, predictions, leagues, and leaderboard persistence
- Static/local content for F1 lessons and Sepang educational content where practical

### UI engineering principle

> **shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

Default shadcn visuals are not the product design. All primitives must use the exact SEPANG 56 tokens and component rules in `DESIGN.md` and `docs/ui-standardization.md`.

Identity-heavy elements such as the race header, driver cards, prediction shell, timing leaderboard, circuit information panel, starting lights, and Three.js scenes are custom SEPANG components.

## Finalized product standards

- `docs/learn-flow-standard.md`
- `docs/sepang-flow-standard.md`
- `docs/prediction-flow-standard.md`
- `docs/scoring-standard.md`
- `docs/league-leaderboard-standard.md`
- `docs/auth-persistence-standard.md`
- `docs/component-architecture.md`
- `docs/implementation-blueprint.md`

Responsive/design standards remain in `DESIGN.md`, `docs/ui-standardization.md`, and the `docs/mobile-*.md` files.

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

Google Stitch outputs are used as **visual/composition baselines**, not production specifications.

Generated Stitch HTML and generated design files can contain substituted fonts, inconsistent palettes, fake telemetry, invented navigation, and route-specific component styling. Codex/OpenCode must standardize those references against the repo source-of-truth documents.

Do not reproduce Stitch exports line-for-line.

## MVP exclusions

The MVP does **not** include AI chat/tutoring, live race telemetry, live timing, weather APIs, race simulators, tyre strategy calculators, live GPS, fantasy systems, social feeds, payments, native apps, admin CMS work, automated race-result ingestion, or league social/moderation systems.

Decorative Stitch labels such as live timing, circuit-open status, countdown timers, coordinates, and fake system telemetry are not product features.

3D/WebGL is **not** generally open-ended. It is allowed only for the explicitly approved experiences in `docs/threejs-experience.md` unless product scope is changed by the owner.
