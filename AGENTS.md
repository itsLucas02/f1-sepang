# SEPANG 56 — Agent Instructions

## Product source of truth

Read these before changing product behavior or UI:

- `README.md`
- `DESIGN.md`
- `docs/product-blueprint.md`
- `docs/user-flow.md`
- `docs/wireframes.md`
- `docs/design-direction.md`
- `docs/threejs-experience.md`
- `docs/stitch-design-brief.md`

## Scope lock

The MVP is exactly:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

Do not add speculative product features without explicit instruction.

## Explicitly out of scope

Do not implement:

- AI chatbot or AI tutor
- Weather API
- Live race telemetry
- Live timing
- Real-time driver GPS
- Race simulator
- Tyre strategy calculator
- Fantasy F1 systems
- Messaging/chat
- Social feed
- Achievements/badges
- Notification system
- Payments
- Admin CMS
- Native mobile app

## Three.js is approved, but NOT open-ended

Three.js/WebGL is part of the MVP presentation layer. Its use is predetermined in `docs/threejs-experience.md`.

Do not decide independently where to add 3D. Implement only the approved scenes and interactions unless the product owner explicitly changes scope.

Core product actions must remain usable if 3D fails to load, the device is constrained, or reduced motion is enabled.

## UX principles

- Design for people who know zero F1.
- Explain jargon at first use.
- Keep lessons short and visual.
- Use one prediction question per screen.
- Delay auth until persistence/social actions require it.
- Mobile must be first-class, not a scaled-down desktop afterthought.
- Prefer simple, inspectable implementation over clever architecture.

## Visual principles

The UI must feel unmistakably motorsport/F1-inspired even without the project logo.

Use racing/timing/grid/circuit visual language. Avoid generic SaaS styling, excessive pill UI, and endless rounded cards.

Do not copy protected Formula 1 logos, exact brand assets, or proprietary fonts.

## Design authority

Codex/OpenCode are implementers, not product designers for this project.

When design behavior is specified in `DESIGN.md`, `docs/design-direction.md`, `docs/threejs-experience.md`, `docs/wireframes.md`, or an approved Stitch output, follow it. Do not replace specified interaction patterns with a different design because it is easier to code.

If specifications conflict, prefer the most recently approved product documentation and flag the conflict rather than inventing a new direction.

## Engineering principles

- Keep scope minimal.
- Prefer established libraries.
- Favor composable modules.
- Avoid premature abstractions.
- Keep content/data static when a database is not yet needed.
- Do not introduce a CMS for MVP.
- Keep 3D isolated from product/business state through clean component boundaries.
- Lazy-load heavy 3D assets.
- Make small, reviewable changes.
