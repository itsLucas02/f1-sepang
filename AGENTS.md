# SEPANG 56 — Agent Instructions

## Product source of truth

Read these before changing product behavior or UI:

- `README.md`
- `DESIGN.md`
- `docs/ui-standardization.md`
- `docs/component-architecture.md`
- `docs/learn-flow-standard.md`
- `docs/sepang-flow-standard.md`
- `docs/prediction-flow-standard.md`
- `docs/mobile-landing-standard.md`
- `docs/mobile-prediction-standard.md`
- `docs/mobile-circuit-standard.md`
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

The following core flows are finalized:

- Learn → `docs/learn-flow-standard.md`
- Understand Sepang → `docs/sepang-flow-standard.md`
- Predictions → `docs/prediction-flow-standard.md`

Those dedicated flow standards override older/broader flow descriptions if any conflict remains elsewhere in the repo.

Scoring values/edge cases, league ranking/tie mechanics, and final auth/provider persistence details are not yet fully finalized. Do not invent missing product rules during implementation.

### Prediction rules that are already locked

Do not reinterpret these:

- exactly eight prediction questions
- no Pole Position question
- one question per screen
- podium choices cannot duplicate drivers
- anonymous draft allowed before auth
- summary before persistence
- auth handoff must preserve the draft
- one common pre-race deadline
- submitted picks remain editable before the deadline
- picks lock automatically at the deadline
- `draft`, `submitted`, and `locked` are distinct states
- no manual irreversible `LOCK PICKS` action before the deadline

## Explicitly out of scope

Do not implement:

- AI chatbot or AI tutor
- AI prediction advice
- betting / wagering / prediction markets
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

Do not infer that decorative Stitch labels such as `LIVE TIMING`, `CIRCUIT: OPEN`, countdowns, coordinates, telemetry, `ALL SYSTEMS NOMINAL`, technical-spec links, `LIVE TELEMETRY ACTIVE`, fake entry speed/G-force, or telemetry CTAs are real features. They are not.

## Design authority and Stitch outputs

Codex/OpenCode are implementers, not product designers for this project.

`DESIGN.md`, `docs/ui-standardization.md`, `docs/component-architecture.md`, finalized flow standards, and approved responsive standards such as `docs/mobile-landing-standard.md`, `docs/mobile-prediction-standard.md`, and `docs/mobile-circuit-standard.md` override generated Stitch HTML/`DESIGN.md` exports whenever they conflict.

Approved Stitch screenshots/HTML are visual baseline references for composition only. Preserve strong approved composition patterns, but do not copy generated design tokens, substitute fonts, invented navigation, fake data, copy, inline prototype JavaScript, or inconsistent components literally.

When two Stitch screens differ, standardize them according to the repo design contract rather than preserving the inconsistency.

## shadcn/ui contract

The detailed component ownership and primitive mapping is finalized in `docs/component-architecture.md`.

Use shadcn/Radix where it gives us reliable accessible interaction behavior.

**shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

Never choose a shadcn component merely because its default appearance resembles the desired UI. Choose it only when its interaction primitive correctly models the required behavior.

Good candidates include Dialog, AlertDialog, Sheet/Drawer, Tooltip, Tabs, DropdownMenu, Form primitives, RadioGroup, Progress, Toast/Sonner, and Select when appropriate.

Do not use the default shadcn visual theme as the application identity.

All shadcn components must inherit/map to the exact SEPANG 56 design tokens in `DESIGN.md`, including:

- colors
- Barlow Condensed / Titillium Web / IBM Plex Mono roles
- 4px geometry
- restrained borders
- racing-red active/primary states

Identity-heavy components should be custom instead of stock-looking shadcn cards/tables, even when Radix/shadcn behavior is used internally:

- RaceHeader
- RaceFlowHeader
- RaceFooter
- JourneyStepCard
- FamiliarityCard
- LessonStep
- RaceReadyMoment
- DriverCard
- PredictionStep
- CircuitInfoPanel
- CircuitHotspotTabs
- TimingLeaderboard
- StartingLights
- SepangCircuitScene

## Three.js is approved, but NOT open-ended

Three.js/WebGL is part of the MVP presentation layer. Its use is predetermined in `docs/threejs-experience.md`.

Do not decide independently where to add 3D. Implement only the approved scenes and interactions unless the product owner explicitly changes scope.

Core product actions must remain usable if 3D fails to load, the device is constrained, or reduced motion is enabled.

Three.js must display application state rather than own navigation/business state. This is especially important in the Sepang circuit explorer.

## UX principles

- Design for people who know zero F1.
- Explain jargon at first use.
- Keep lessons short and visual.
- Use one prediction question per screen.
- Delay auth until persistence/social actions require it.
- Mobile must be first-class, not a scaled-down desktop afterthought.
- Prefer simple, inspectable implementation over clever architecture.
- Learn and Sepang milestones are encouragement, not hard gates.

## Visual principles

The UI must feel unmistakably current premium motorsport even without the project logo.

It must **not** become futuristic, cyberpunk, neon, HUD-heavy, or generic SaaS.

Use the exact tokens in `DESIGN.md`. Do not substitute generated fonts/colors because a design export contains them.

Do not copy protected Formula 1 logos, exact brand assets, or proprietary fonts.

## Engineering principles

- Keep scope minimal.
- Prefer established libraries.
- Favor composable modules.
- Avoid premature abstractions.
- Keep content/data static when a database is not yet needed.
- Do not introduce a CMS for MVP.
- Keep 3D isolated from product/business state through clean component boundaries.
- Lazy-load heavy 3D assets.
- Centralize tokens and shared shell/components instead of restyling per page.
- Make small, reviewable changes.
