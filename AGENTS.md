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
- `docs/scoring-standard.md`
- `docs/league-leaderboard-standard.md`
- `docs/auth-persistence-standard.md`
- `docs/implementation-blueprint.md`
- `docs/mobile-landing-standard.md`
- `docs/mobile-prediction-standard.md`
- `docs/mobile-circuit-standard.md`
- `docs/product-blueprint.md`
- `docs/user-flow.md`
- `docs/wireframes.md`
- `docs/design-direction.md`
- `docs/threejs-experience.md`
- `docs/stitch-design-brief.md`
- `docs/visual-language.md`

## Implementation phase

The MVP is now **implementation-ready**.

Build according to `docs/implementation-blueprint.md` and the dedicated finalized product standards. Do not reopen settled product decisions during coding unless an actual implementation constraint requires product-owner review.

The MVP is exactly:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

Do not add speculative product features.

Finalized product standards:

- Learn → `docs/learn-flow-standard.md`
- Understand Sepang → `docs/sepang-flow-standard.md`
- Predictions → `docs/prediction-flow-standard.md`
- Scoring → `docs/scoring-standard.md`
- Leagues / Leaderboards → `docs/league-leaderboard-standard.md`
- Auth / Persistence → `docs/auth-persistence-standard.md`

Dedicated standards override older/broader descriptions if a conflict remains elsewhere in the repo.

## Locked prediction / competition rules

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
- picks become read-only automatically at/after the deadline
- no manual irreversible `LOCK PICKS` action
- scoring maximum is 25 points
- exact-match scoring only; no partial credit
- ties remain ties using competition ranking (`1, 2, 2, 4`)
- one user score is reused across every league
- users may belong to multiple leagues
- creating/joining leagues requires auth
- MVP auth is Supabase Auth + Google OAuth only

## KISS / YAGNI rule

Prefer the smallest direct implementation that satisfies the finalized MVP.

Do not build generalized infrastructure for hypothetical future requirements.

Examples:

- static lesson/Sepang content instead of CMS
- one JSON prediction answer object instead of generic question tables
- one configured race deadline instead of scheduling infrastructure
- one deterministic scoring function instead of a rules engine
- one league membership table instead of a social platform
- local storage for anonymous progress instead of offline-sync infrastructure
- Google OAuth only instead of multi-provider auth
- no admin CMS for entering eight race-result answers

If a direct implementation is clear and testable, prefer it over abstraction.

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
- league roles/moderation/seasons/custom scoring
- generic prediction-question engine
- automated race-result ingestion

Do not infer that decorative Stitch labels such as `LIVE TIMING`, `CIRCUIT: OPEN`, countdowns, coordinates, `ALL SYSTEMS NOMINAL`, technical-spec links, `LIVE TELEMETRY ACTIVE`, fake entry speed/G-force, or telemetry CTAs are real features. They are not.

### Approved exception — the derived hot lap

The Sepang explorer ships one **simulated hot lap** derived from the circuit
geometry (`lib/telemetry.ts`, `lib/circuit-geometry.ts`, `lib/sepang-telemetry.ts`).
Speed, gear, pedal traces, lap time and sector splits come from that
deterministic model and are always labelled as simulated. This is approved
product scope and is documented in `docs/threejs-experience.md`.

It must never be presented as live timing, and it must never gate a product
action.

## Design authority and Stitch outputs

Codex/OpenCode are implementers, not product designers for this project.

`DESIGN.md`, `docs/ui-standardization.md`, `docs/component-architecture.md`, finalized product standards, and approved responsive standards override generated Stitch HTML/`DESIGN.md` exports whenever they conflict.

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

Identity-heavy components should be custom even when Radix/shadcn behavior is used internally:

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

Three.js must display application state rather than own navigation/business state.

## UX principles

- Design for people who know zero F1.
- Explain jargon at first use.
- Keep lessons short and visual.
- Use one prediction question per screen.
- Delay auth until persistence/social actions require it.
- Mobile must be first-class, not a scaled-down desktop afterthought.
- Learn and Sepang milestones are encouragement, not hard gates.
- Preserve anonymous work through auth.

## Visual principles

The UI must feel unmistakably current premium motorsport even without the project logo.

It must **not** become futuristic, cyberpunk, neon, HUD-heavy, or generic SaaS.

Use the exact tokens in `DESIGN.md`. Do not substitute generated fonts/colors because a design export contains them.

Do not copy protected Formula 1 logos, exact brand assets, or proprietary fonts.

## Engineering principles

- Follow the build order in `docs/implementation-blueprint.md`.
- Keep scope minimal.
- Prefer established libraries.
- Favor composable modules.
- Avoid premature abstractions.
- Keep content/data static when a database is not needed.
- Do not introduce a CMS.
- Keep 3D isolated from product/business state through clean component boundaries.
- Lazy-load heavy 3D assets.
- Centralize tokens and shared shell/components instead of restyling per page.
- Enforce prediction deadlines on the write path, not only in client UI.
- Use small explicit Supabase RLS policies.
- Unit test deterministic scoring and other competition-critical rules.
- Make small, reviewable changes.