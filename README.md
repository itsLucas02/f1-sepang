# SEPANG 56

**Learn F1. Understand Sepang. Make your picks. Beat your friends.**

SEPANG 56 is a beginner-first Formula 1 web app built around Formula 1's return to Sepang. The MVP is intentionally narrow in product scope but ambitious in presentation:

1. **Learn** — understand the minimum F1 concepts needed to enjoy a race.
2. **Understand Sepang** — explore what makes Sepang interesting and important.
3. **Make predictions** — pick likely race outcomes using what you just learned.
4. **Compete with friends** — join private leagues and compare scores.

This repository is the working source of truth for the Kracked Devs Formula 1 Sepang bounty project.

## Product principle

Every feature must make sense to someone who knows **zero F1**.

If a beginner encounters unexplained jargon, the interface has failed.

## Experience principle

The feature set is deliberately modest. The presentation is not.

SEPANG 56 should feel like an interactive motorsport experience rather than a generic learning/prediction website. Three.js is part of the planned MVP experience layer, but its use is predetermined in `docs/threejs-experience.md`; coding agents should not invent additional 3D features.

## Planned web stack

- React / Next.js-style component architecture
- TypeScript
- Tailwind CSS
- Three.js for the explicitly defined 3D scenes
- Motion library such as Framer Motion and/or GSAP for non-3D UI transitions
- Supabase for auth, predictions, leagues, and leaderboard persistence
- Static/local content for F1 lessons and Sepang educational content where practical

Final implementation details may be refined before coding, but Three.js is an intentional part of the experience architecture.

## MVP exclusions

The MVP does **not** include AI chat/tutoring, live race telemetry, weather APIs, race simulators, tyre strategy calculators, live GPS, fantasy systems, social feeds, payments, native apps, or admin CMS work.

3D/WebGL is **not** generally open-ended. It is allowed only for the explicitly approved experiences in `docs/threejs-experience.md` unless product scope is changed by the owner.

See `docs/` plus `DESIGN.md` for the current product blueprint, flows, wireframes, racing-first design system, Three.js experience map, and Stitch exploration brief.
