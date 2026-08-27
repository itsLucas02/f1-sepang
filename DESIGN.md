# SEPANG 56 — Design System Contract

This file is the portable visual design contract for SEPANG 56 and is intended to be usable by design agents such as Google Stitch as well as implementation agents such as Codex/OpenCode.

For detailed 3D scene behavior, read `docs/threejs-experience.md`.

## Product feeling

SEPANG 56 should feel:

- fast
- precise
- competitive
- cinematic
- Malaysian
- premium
- beginner-friendly

It should not feel:

- corporate SaaS
- generic online education
- childish
- crypto-dashboard-like
- overly technical
- cluttered esports UI

## Core visual blend

Use a deliberate blend of:

1. **Motorsport broadcast** — timing/classification structures, grid positions, race numerals, telemetry labels, circuit linework.
2. **Premium racing-game presentation** — cinematic scene framing, starting-light moments, driver-selection energy, 3D-ready compositions.
3. **Premium editorial** — bold hierarchy, confident negative space, large typography, disciplined storytelling.

## Color roles

### Canvas / surface

- Primary canvas: near-black / asphalt / graphite.
- Secondary surfaces: slightly lifted graphite tones with restrained contrast.
- Warm white / off-white for primary text.

### Accent

- Racing red: primary action, urgency and major active state.
- Do not use racing red as background decoration everywhere.

### Semantic race signals

- Green: success / go / positive race-state signal.
- Yellow: caution / warning.
- Red: stop / critical / lock / primary race intensity depending on context.

Malaysian identity may appear through subtle secondary accents, content, imagery and circuit context without turning the interface into a flag-themed design.

## Typography roles

Use three complementary roles:

### Display

Extended/wide/geometric sans-serif character with motorsport-poster energy.

Use for:

- hero headlines
- major section titles
- oversized race numerals

### UI / body

Highly legible modern sans/grotesk.

Use for:

- explanations
- controls
- educational copy
- forms

### Telemetry / technical labels

Condensed sans or restrained monospace-style typography.

Use for:

- positions
- scores
- lap-like progress
- section indexes
- micro labels
- league codes
- small technical metadata

Use tabular numerals for rankings/scores where available.

Do not copy official Formula 1 proprietary typefaces.

## Shape language

- Prefer sharp technical geometry.
- Subtle chamfered corners are encouraged.
- Avoid excessive fully rounded containers.
- Pills should be exceptional, not the default control language.
- Dividers may borrow from track markings, grid slots and timing rails.

## Layout language

- Strong directional composition.
- Asymmetry is encouraged when reading order remains obvious.
- Use large numeric section markers such as `01`, `02`, `56`.
- Use full-bleed circuit/scene moments.
- Use starting-grid and timing-table structures as conceptual layout references.
- Avoid making every piece of information a floating card.

## Signature motif

The Sepang circuit outline/model is the signature visual asset.

It should recur across:

- landing hero
- Sepang explorer
- section transitions
- progress/branded moments

Do not overuse it as meaningless decoration.

## Motion language

Motion should communicate speed, commitment and race-state change.

Prefer:

- quick directional entrances
- decisive snap/slide transitions
- circuit-path drawing
- position changes
- number rolling where useful
- starting-light sequencing
- camera moves only for approved Three.js scenes

Avoid slow floating/fading SaaS motion.

Always respect reduced-motion preferences.

## Buttons

- Strong contrast.
- Sharp or subtly chamfered silhouette.
- Primary CTA should feel decisive.
- Labels should use direct verbs: `GET RACE READY`, `SELECT`, `NEXT`, `LOCK PICKS`, `JOIN LEAGUE`.

## Cards

Cards are appropriate for:

- driver choices
- team comparisons
- compact learning modules where grouping is necessary

Do not turn every screen into a grid of rounded cards.

## Leaderboard

The leaderboard should evoke a race timing/classification tower.

Prioritize:

- rank/position
- username
- score
- clear movement/state
- gap-style presentation where useful

It should not resemble a generic admin table.

## Learning screens

- One concept at a time.
- Visual demonstration first where possible.
- Short beginner explanation.
- One obvious continuation action.
- No dense article layout.

## Predictions

- One prediction task per screen.
- Selection should feel like setting a grid/pick, not completing a form.
- Driver selection gets strong identity and large readable names.
- Review screen becomes more conventional/readable before lock-in.

## Sepang explorer

The 3D circuit is the hero.

Desktop:

- circuit can dominate viewport
- side panel for hotspot content
- broader camera composition

Mobile:

- circuit remains prominent but constrained for touch/readability
- details use bottom sheet or stacked panel
- large hotspot targets
- shorter camera transitions

## Responsive philosophy

Desktop and mobile are related designs, not identical layouts at different widths.

### Desktop should exploit

- width
- cinematic negative space
- split layouts
- simultaneous scene + context

### Mobile should prioritize

- vertical storytelling
- thumb reach
- large touch targets
- one primary action at a time
- reduced scene complexity
- nearby/fixed actions where useful

Never rely on hover for required functionality.

## Accessibility

- Maintain sufficient text/background contrast.
- Do not communicate status by color alone.
- Keyboard access for conventional controls.
- Large mobile touch targets.
- `prefers-reduced-motion` support.
- Critical content and actions remain accessible without WebGL.

## Brand/legal boundary

The product may be Formula 1-inspired but must not imitate protected official branding.

Do not copy:

- official F1 logo
- proprietary official fonts
- protected broadcast graphics one-to-one
- team logos/assets unless usage rights are confirmed

Create an original SEPANG 56 identity using motorsport visual principles.

## Final visual test

Before approving a screen, ask:

> If the SEPANG 56 logo disappeared, would this still unmistakably feel like a premium motorsport/race-weekend experience?

If not, the screen is too generic.
