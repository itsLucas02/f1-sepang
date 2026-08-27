# SEPANG 56 — Mobile Circuit Explorer Standard

This document standardizes the approved Google Stitch mobile Circuit Explorer reference into the canonical SEPANG 56 design system.

The Stitch mobile export is a **composition baseline**, not production code. Preserve the strong mobile structure, but replace generated tokens, font substitutions, fake telemetry, invented bottom navigation, and engineering-simulator copy with the approved SEPANG 56 system.

`DESIGN.md`, `docs/ui-standardization.md`, and `docs/threejs-experience.md` remain authoritative.

## Approved mobile composition

Preserve this overall flow:

1. compact mobile app shell
2. page title: `SEPANG INTERNATIONAL CIRCUIT`
3. metadata: `SEPANG / MALAYSIA`
4. large primary circuit scene
5. horizontally scrollable hotspot selector
6. selected-hotspot detail section
7. `WHY IT MATTERS` explanation block

Do not reproduce the Stitch HTML line-for-line.

## Mobile app shell

Use the shared mobile `RaceHeader` instead of inventing a separate navigation system.

```text
Header background      #13131B
Header text            #FFFFFF
Header border          #32323C
Canvas                 #1A1A24
Mobile page margin     20px
Minimum touch target   44px
```

Recommended mobile header:

- left: `SEPANG 56`
- right: menu button
- menu opens a shadcn `Sheet` / `Drawer`
- destinations exactly: `LEARN`, `SEPANG`, `PREDICT`, `LEADERBOARD`

Do not use Stitch's generated bottom navigation with `HOME / CIRCUIT / DATA / PROFILE`.

The circuit title belongs in the page content below the shared header, not as a replacement product header.

## Page title

```text
SEPANG INTERNATIONAL CIRCUIT
SEPANG / MALAYSIA
```

Use:

- Barlow Condensed 800 for the title
- IBM Plex Mono 400/500 for metadata
- `#FFFFFF` primary text
- `#B7B7BF` or `#777781` metadata

On narrow screens, the two-line title treatment is approved.

## Primary circuit scene

The large circuit visual from Stitch is approved as the main mobile hero.

Production implementation becomes the approved mobile `SepangCircuitScene` Three.js experience, with a static/2D fallback.

```text
Width        100%
Background   #111118
Border       #32323C
Radius       4–6px
Min height   about 300px where practical
```

Preserve:

- recognizable Sepang geometry
- atmospheric dark presentation
- visible hotspot markers
- one selected hotspot using `#E10600`
- scene-first mobile hierarchy

Do not preserve:

- `LIVE TELEMETRY ACTIVE`
- fake track status
- fake timing
- fake temperature
- fake speed/G-force readouts
- fake coordinates
- engineering-dashboard overlays
- glowing sci-fi HUD treatment

The circuit should feel interactive and premium, not like race-control software.

## Hotspot selector

The horizontal selector immediately under the circuit is approved.

Approved MVP hotspots:

- `T1`
- `T4`
- `T9`
- `T15`
- `MAIN STRAIGHT`

Create one reusable `CircuitHotspotTabs` component. shadcn Tabs behavior is acceptable if fully skinned.

Base:

```text
Height       44px minimum
Background   #111118 or #181820
Border       #32323C
Text         #FFFFFF / #B7B7BF
Font         Titillium Web 600 / 14px
Radius       4px
```

Selected:

- border / active rail `#E10600`
- white text
- optional subtle red tint
- no glow

Horizontal scrolling is allowed on narrow devices. Scrollbar may be visually hidden if keyboard/touch accessibility remains intact.

## Selected hotspot detail

Preserve the stacked detail layout below the selector.

Structure:

```text
03 / CIRCUIT
TURN 15
short beginner explanation
WHY IT MATTERS
short beginner explanation
```

Use:

- IBM Plex Mono for `03 / CIRCUIT`
- Barlow Condensed 800 for `TURN 15`
- Titillium Web for paragraphs
- `#E10600` only for the small active/progress accent

Canonical tone:

### TURN 15

> A tight final corner before the main straight. Drivers slow heavily here before accelerating onto the straight.

### WHY IT MATTERS

> It is an important place to watch for late-braking attacks and position changes.

This content is intentionally simpler than Stitch's engineering-heavy prose.

## `WHY IT MATTERS` block

The bordered explanation card is approved as a visual pattern.

```text
Background   #111118 or #181820
Border       #32323C
Radius       4px
Padding      20–24px
```

A small red icon/rail may be used, but do not style the block as a warning unless the content is actually a warning.

Do not include fake stat rows such as:

- `ENTRY SPEED 285 KM/H`
- `APEX G-FORCE 3.2 G`
- gear
- lap delta
- aero balance

unless real sourced data is explicitly approved as product content later.

## Bottom action

Remove Stitch's `VIEW DRIVER TELEMETRY` CTA. It implies an out-of-scope feature.

The Circuit Explorer does not require a persistent bottom CTA in MVP.

If a contextual action is later approved, it must describe a real function such as:

- `NEXT HOTSPOT`
- `RESET VIEW`
- `CONTINUE TO PREDICT`

Do not invent telemetry-related destinations.

## Navigation behavior

The mobile Circuit Explorer remains part of the normal application shell.

Use the same mobile menu/navigation model as Landing rather than a separate bottom-nav information architecture.

Do not introduce `DATA`, `PROFILE`, or `HOME` as new top-level routes merely because Stitch generated them.

## Exact design system

```text
Header / Footer      #13131B
Canvas               #1A1A24
Surface 01           #111118
Surface 02           #181820
Surface 03           #22222B
Border               #32323C
Text Primary         #FFFFFF
Text Secondary       #B7B7BF
Text Muted           #777781
Race Red             #E10600
Warning Yellow       #FFD100
Warning Text         #0B0B0B
```

Typography remains exactly:

```text
Display / Headings    Barlow Condensed
Body / UI             Titillium Web
Technical Metadata    IBM Plex Mono
```

Never use Hanken Grotesk or Stitch's generated brown/rose/blue palette.

## Three.js behavior

Mobile Three.js behavior follows `docs/threejs-experience.md`:

- shorter camera movement than desktop
- tap is authoritative; no hover dependency
- hotspots large enough to tap
- reset/recenter always reachable if camera navigation exists
- no precision gesture required to access educational content
- reduced-motion mode minimizes camera transitions
- static/2D fallback remains understandable

The Three.js scene receives `selectedHotspot` state from the app layer; it does not own product state.

## Component model

```text
MobileCircuitExplorer
├── RaceHeader (mobile mode)
├── CircuitPageHeading
├── SepangCircuitScene / fallback
├── CircuitHotspotTabs
├── CircuitInfoPanel
│   ├── category/progress label
│   ├── hotspot title
│   ├── beginner explanation
│   └── WhyItMatters block
└── RaceFooter only if the page naturally reaches document end
```

Do not create separate page-specific versions of shared components unless there is a real UX requirement.

## Preserve vs replace from Stitch

### Preserve

- large visual-first circuit composition
- title hierarchy
- horizontal hotspot control
- selected red `T15` state
- stacked `TURN 15` explanation
- bordered `WHY IT MATTERS` block
- generous mobile spacing

### Replace / remove

- Hanken Grotesk → Titillium Web
- old red `#E90B18` → `#E10600`
- generated brown/rose/blue tokens → canonical tokens
- `LIVE TELEMETRY ACTIVE` → remove
- fake entry speed / G-force → remove
- `VIEW DRIVER TELEMETRY` → remove
- `HOME / CIRCUIT / DATA / PROFILE` bottom nav → shared SEPANG 56 navigation
- engineering-heavy copy → beginner-first copy

## Final validation

- product remains `SEPANG 56`
- circuit remains Sepang International Circuit
- title uses Barlow Condensed
- body uses Titillium Web
- metadata uses IBM Plex Mono
- canvas is `#1A1A24`
- selected state uses `#E10600`
- hotspot targets are at least 44px
- circuit is the primary visual
- no fake telemetry/status/statistics remain
- no invented bottom-nav destinations remain
- mobile composition is clear without hover or precision gestures
- a beginner can understand what Turn 15 is and why it matters
