# SEPANG 56 — Mobile Landing Standard

This document standardizes the approved Google Stitch mobile Landing reference into the canonical SEPANG 56 design system.

The Stitch mobile landing is a **composition reference**, not production code. Preserve its strongest ideas while removing generated font substitutions, fake live-status UI, pseudo-telemetry, technical copy, old palette values, and footer inventions.

`DESIGN.md` remains authoritative for tokens, typography, geometry, and brand rules.

## Approved composition

Preserve this mobile flow:

1. compact mobile `RaceHeader`
2. generous breathing room before the hero
3. `SEPANG / MALAYSIA` eyebrow
4. `F1 RETURNS TO SEPANG` headline
5. short beginner-first description
6. full-width `GET RACE READY` CTA
7. one large cinematic Sepang/racing visual
8. four vertically stacked product-step cards
9. quiet centered mobile footer

Do not reproduce Stitch HTML line-for-line.

## Mobile shell

Design should work from roughly `360px` upward and remain comfortable at common `390–430px` widths.

```text
Horizontal page margin   20px
Header background        #13131B
Header text              #FFFFFF
Header height            56px minimum
Header border            #32323C
Canvas                   #1A1A24
```

The mobile `RaceHeader` keeps `SEPANG 56` on the left and a menu control with at least a `44x44px` touch target on the right.

The menu uses shadcn `Sheet`/`Drawer` behavior and contains exactly:

- LEARN
- SEPANG
- PREDICT
- LEADERBOARD

Do not add `LIVE TIMING`, `CIRCUIT: OPEN`, countdowns, technical status, or pseudo-live information.

## Mobile hero

Order:

```text
SEPANG / MALAYSIA
F1 RETURNS TO SEPANG
Beginner-first supporting copy
GET RACE READY
```

### Eyebrow

- IBM Plex Mono 500
- 12px
- `#B7B7BF` or `#777781`
- optional short `#E10600` line/dot

Do not use an animated status dot that implies a real live feed.

### Heading

- Barlow Condensed 800
- about 38–42px on mobile
- line-height about 0.95–1.0
- `#FFFFFF`

### Body copy

Use Titillium Web.

Canonical direction:

> You don't need to know F1 to enjoy F1. Learn the basics, understand Sepang, make your picks and compete with your friends.

Do not use `All systems nominal`, premium-motorsport marketing language, or engineering/race-control copy.

### CTA

On narrow mobile widths, `GET RACE READY` is normally full-width.

```text
Height       44px minimum
Background   #E10600
Text         #FFFFFF
Font         Titillium Web 700 / 14px / uppercase
Radius       4px
```

## Cinematic visual

The large visual block below the hero is approved.

In production this region becomes the mobile Landing Three.js scene from `docs/threejs-experience.md`; a strong static Sepang/racing fallback is acceptable before 3D is ready.

```text
Background     #111118
Border         #32323C
Radius         4–6px
Width          100%
```

Remove all fake HUD overlays:

- `CIRCUIT: OPEN`
- `LIVE TIMING`
- countdown timer
- fake coordinates
- temperatures
- telemetry
- pseudo-live badges

The visual should breathe without fake system decoration.

## Four-step journey cards

The stacked-card treatment is approved for mobile. Implement one reusable `JourneyStepCard`.

```text
JourneyStepCard
├── step number
├── small icon
├── title
└── short description
```

Base styling:

```text
Background   #111118
Border       1px #32323C
Radius       4px
Padding      24px
```

A subtle oversized background step number such as `01` is allowed if readability remains high.

Canonical copy:

### 01 — LEARN
> Learn the F1 basics you need for race day.

### 02 — SEPANG
> Discover the circuit and what makes it special.

### 03 — PREDICT
> Make your race-weekend picks.

### 04 — COMPETE
> See how your predictions compare with friends.

Do not use Stitch wording about mastering aerodynamics, analyzing telemetry, forecasting pit-stop windows, thousands of fans globally, or `Knowledge is speed`.

If cards are navigational, the whole card may be tappable with a visible focus state and at least 44px practical touch height. No glow or hover-required behavior.

## Mobile footer

Use shared `RaceFooter` in a centered mobile composition.

```text
Background      #13131B
Top border      #32323C
Brand           SEPANG 56
Optional links  Terms / Privacy / About
```

Remove `CIRCUIT STATUS`, `TECHNICAL SPECS`, `ALL SYSTEMS NOMINAL`, and fake company/system copy.

## Exact visual system

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
Stripe Dark          #1D1D25
Stripe Light         #50515E
Warning Yellow       #FFD100
Warning Text         #0B0B0B
```

Typography remains exactly:

```text
Display / Headings    Barlow Condensed
Body / UI             Titillium Web
Technical Metadata    IBM Plex Mono
```

Never use Hanken Grotesk or Stitch's brown/rose generated palette.

## Motion

- normal mobile UI transitions: roughly 150–250ms
- no floaty card motion
- no long reveal before the CTA is usable
- mobile Three.js opening sequence is shorter than desktop
- reduced-motion mode skips cinematic camera movement

## Responsive relationship to desktop

Desktop baseline:

```text
hero copy | cinematic scene
four-step horizontal rail
```

Mobile baseline:

```text
hero copy
full-width CTA
cinematic scene
stacked journey cards
```

This difference is intentional and approved. Do not force the desktop split hero or horizontal rail onto mobile.

## Component model

```text
MobileLanding
├── RaceHeader (mobile mode)
├── LandingHero
├── LandingScene / static fallback
├── JourneyStepList
│   └── JourneyStepCard x4
└── RaceFooter (mobile mode)
```

Components/tokens are shared with desktop; this is not a separate mobile design system.

## Final validation

- Header is `#13131B`
- Canvas is `#1A1A24`
- CTA is `#E10600`
- Barlow Condensed / Titillium Web / IBM Plex Mono are used correctly
- page margin is `20px`
- CTA and menu meet 44px touch targets
- no fake live timing/status/countdown/telemetry appears
- hero copy is beginner-first
- journey cards use simple MVP copy
- footer has no fake technical/system language
- mobile is a purposeful recomposition of desktop
- visual remains clean premium current-generation motorsport, not futuristic/game-like
