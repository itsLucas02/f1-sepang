# SEPANG 56 — UI Standardization Contract

This document exists to reconcile visual references from Google Stitch into one consistent implementation.

The Stitch Landing and Prediction exports are useful composition baselines, but they are **not internally consistent design systems**. Implementation must standardize them using `DESIGN.md`.

---

## 1. Source priority

When references conflict, use this order:

1. `DESIGN.md`
2. this file
3. product flow / wireframes
4. approved Stitch screenshot composition
5. Stitch-generated HTML
6. Stitch-generated design export

Never allow a generated HTML token or font substitution to override the repo design contract.

---

## 2. Canonical shared shell

Landing, Learn, Sepang, Predict, Leaderboard, League, and account-facing product screens should feel like the same application.

### Desktop header

Use one shared `RaceHeader` component.

```text
Background      #13131B
Text            #FFFFFF
Accent          #E10600
Height          72px content area
Top stripe      optional subtle #1D1D25 / #50515E treatment
Bottom border   #32323C
```

Navigation is exactly:

- LEARN
- SEPANG
- PREDICT
- LEADERBOARD

Context-appropriate account/action controls may appear on the right.

Do not propagate Stitch inventions such as `LIVE TIMING`, `CIRCUIT: OPEN`, countdown timers, fake status text, `TECHNICAL`, or `STANDINGS`.

### Footer

Use one shared quiet footer:

- `SEPANG 56`
- optional `Terms`, `Privacy`, `About`

No fake system status, fake technical-spec links, fake circuit status, or generated legal/company identity.

---

## 3. Canonical page container

```text
Desktop target        1440px
Content max width     1280px
Desktop side margin   48px
Mobile side margin    20px
Grid                  12 columns
Gutter                24px
```

For focused task pages such as Predictions, content may use a narrower centered region such as `1120px` while still sitting inside the same shell.

Use spacing values from the system scale only:

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`

---

## 4. Canonical typography

Never carry over Hanken Grotesk or other Stitch substitutions.

```text
Display / Headings    Barlow Condensed
Body / UI             Titillium Web
Technical Metadata    IBM Plex Mono
```

Use typography consistently across pages. Prediction does not get a different type system from Landing.

---

## 5. Canonical colors

Use only the authoritative roles from `DESIGN.md`.

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

No brown-tinted Stitch surfaces, arbitrary blue tertiary palette, lime, neon, or page-specific palettes.

---

## 6. Canonical geometry

All conventional UI should share:

- 4px default radius
- 1px subtle border
- mostly rectangular panels
- no default glassmorphism
- no page-specific rounded-card vocabulary

Do not let Landing use one geometry language and Prediction another.

---

## 7. shadcn standard

Use shadcn/Radix for interaction behavior, not visual identity.

**shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

Centralize shadcn styling through tokens/classes so Dialogs, Sheets, Toasts, Tabs, Menus, Progress, Forms, and other primitives all inherit the same colors, fonts, radii, focus states, and motion.

Do not restyle the same shadcn primitive differently on each route without a product reason.

---

## 8. Landing baseline — what to preserve

Preserve from the approved Stitch landing direction:

- dark premium motorsport mood
- shared header
- left copy / right cinematic visual split
- large `F1 RETURNS TO SEPANG` hierarchy
- prominent `GET RACE READY`
- four-step lower rail: Learn / Sepang / Predict / Compete
- generous whitespace

Standardize/remove:

- remove fake live-feed status
- remove coordinates / temperatures / fake telemetry
- remove out-of-scope header items
- use the canonical beginner copy
- use exact colors/fonts from `DESIGN.md`
- replace generated image/scene details with the approved Three.js plan when implemented

---

## 9. Prediction baseline — what to preserve

Preserve:

- focused single-question page
- `01 / 08` progress label
- strong `WHO WINS SEPANG?` hierarchy
- four driver choices on wide desktop
- visual driver portraits
- selected red state
- clear `NEXT` action
- generous breathing room

Standardize/remove:

- use the same canonical header as Landing
- remove live timing / circuit status / countdown items
- use Titillium Web for body/UI instead of Hanken Grotesk
- use exact color tokens
- use consistent 4px card/button radius
- use one common DriverCard component
- ensure unselected cards remain legible
- team color is only a restrained identity rail/accent
- remove generated fake racing data or betting-like presentation
- use shared footer or omit footer during focused flows if intentionally approved; do not invent a second footer style

---

## 10. Canonical DriverCard anatomy

Implement one reusable `DriverCard` rather than reproducing Stitch HTML per driver.

```text
DriverCard
├── portrait / visual area
├── team label
├── race number
├── driver surname
├── optional team accent rail
└── selected indicator
```

Base:

- surface `#111118`
- border `#32323C`
- radius `4px`
- readable portrait overlay

Selected:

- red border and/or 4px bottom rail `#E10600`
- explicit selected icon/state
- no glow

Unselected:

- do not reduce opacity so aggressively that portraits/names become difficult to inspect
- hover/focus may increase contrast, but selection must not depend on hover

Keyboard focus must be visible independently from selection.

---

## 11. Canonical prediction step

Create a reusable `PredictionStep` shell.

```text
PredictionStep
├── progress label
├── question heading
├── short explanation
├── answer region
└── action/footer region
```

This is used for winner, podium, pole, fastest lap, rain, Safety Car, first retirement, etc.

Question types can swap their answer component without changing the page shell.

---

## 12. Sepang Explorer standard

The explorer must use the same application shell and tokens.

Desktop:

- one large 8-column circuit scene
- one 4-column information panel
- 24px gap

Do not create repeated track thumbnails. Do not add engineering telemetry just to look technical.

Mobile:

- scene first
- detail via stacked panel or shadcn Sheet/Drawer
- large touch targets
- shorter camera movements

---

## 13. Warning / toast standard

Warnings and important temporary notices use the approved high-visibility treatment:

```text
Background   #FFD100
Text/Icon    #0B0B0B
Radius       4px
```

Use shadcn/Sonner behavior if appropriate, skinned to these tokens.

Do not use yellow as a normal brand accent.

---

## 14. Component ownership

### Custom SEPANG components

- `RaceHeader`
- `RaceFooter`
- `DriverCard`
- `PredictionStep`
- `CircuitInfoPanel`
- `TimingLeaderboard`
- `StartingLights`
- `SepangCircuitScene`
- learning visual components

### shadcn/Radix-backed behavior

- Dialog
- AlertDialog
- Sheet / Drawer
- Tooltip
- Tabs
- DropdownMenu
- Form controls
- Progress
- Toast / Sonner
- Select where useful

The same design tokens apply to both categories.

---

## 15. Implementation rule for Codex/OpenCode

Do **not** turn Stitch HTML into production components line-for-line.

Instead:

1. identify the intended composition
2. map it to shared application primitives
3. apply canonical tokens
4. remove invented/out-of-scope UI
5. build reusable responsive components
6. preserve accessibility
7. verify desktop and mobile separately

The goal is not to reproduce Stitch's inconsistencies. The goal is to use its strongest visual ideas inside one systematic SEPANG 56 product.
