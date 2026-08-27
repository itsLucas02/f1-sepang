# SEPANG 56 — Agent Instructions

## Product source of truth

Read these before changing product behavior or UI:

- `README.md`
- `docs/product-blueprint.md`
- `docs/user-flow.md`
- `docs/wireframes.md`
- `docs/design-direction.md`

## Scope lock

The MVP is exactly:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

Do not add speculative features without explicit instruction.

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
- 3D circuit / WebGL
- Payments
- Admin CMS
- Native mobile app

## UX principles

- Design for people who know zero F1.
- Explain jargon at first use.
- Keep lessons short and visual.
- Use one prediction question per screen.
- Delay auth until persistence/social actions require it.
- Mobile must be first-class.
- Prefer simple, inspectable implementation over clever architecture.

## Visual principles

The UI must feel unmistakably motorsport/F1-inspired even without the project logo.

Use racing/timing/grid/circuit visual language. Avoid generic SaaS styling, excessive pill UI, and endless rounded cards.

Do not copy protected Formula 1 logos, exact brand assets, or proprietary fonts.

## Engineering principles

- Keep scope minimal.
- Prefer established libraries.
- Favor composable modules.
- Avoid premature abstractions.
- Keep content/data static when a database is not yet needed.
- Do not introduce a CMS for MVP.
- Make small, reviewable changes.
