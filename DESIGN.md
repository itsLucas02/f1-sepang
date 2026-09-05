# SEPANG 56 — Design System Contract

This file is the authoritative visual source of truth for SEPANG 56.

Stitch exports are **reference material only**. Their generated colors, font substitutions, invented telemetry, navigation, copy, spacing, and component decisions are not authoritative when they conflict with this file.

Codex/OpenCode must implement this system rather than reinterpret it. For approved 3D behavior, also read `docs/threejs-experience.md`. For page/component consistency rules, read `docs/ui-standardization.md`.

---

## 1. Design north star

SEPANG 56 is a **clean, premium, current-generation motorsport web product**.

It should feel plausible as a polished public motorsport experience in 2026: disciplined, fast, editorial, competitive, technical enough to feel authentic, but approachable to someone who knows zero F1.

### It is

- dark-first
- clean and structured
- modern motorsport editorial
- precise
- premium
- racing-oriented
- beginner-friendly
- cinematic only where useful

### It is not

- futuristic sci-fi
- cyberpunk
- neon gaming UI
- esports HUD
- telemetry cosplay
- generic SaaS
- a direct clone of official Formula 1 branding

When choosing between “more futuristic” and “more like a polished real-world motorsport product,” always choose the latter.

---

## 2. Exact color tokens

These values are fixed unless the product owner explicitly changes them.

```text
Header / Footer          #0A0C11
Canvas / Main Background #08090C
Surface 01               #0E1116
Surface 02               #141920
Surface 03               #1B212A
Surface 04               #232B36
Border / Divider         #262D38
Border Strong            #38414F

Text Primary             #F5F6F8
Text Secondary           #B3BCC9
Text Muted               #7D8794

Race Red                 #E8112D
Race Red Bright          #FF2D46
Race Red Deep            #9C0A1E

Sepang Sunset (orange)   #FF7A18
Sepang Amber             #FFB302
Sepang Teal              #00E0C6
Sepang Teal Deep         #06897B

Warning / Toast Yellow   #FFD100
Warning Text             #0B0B0B
Disabled                 #414A58

Podium Gold              #FFCF5C
Podium Silver            #CFD6E0
Podium Bronze            #D08B52
```

### Accent system

`Race Red` remains the dominant brand accent. Two supporting accents, drawn
from the Sepang dusk (tropical sunset over the circuit) are now approved:

- **Sunset `#FF7A18`** — pairs with red in gradients, hover states, and the
  `text-gradient-heat` headline treatment. Never used as a large flat fill.
- **Teal `#00E0C6`** — the *system* accent: focus rings, "ready"/"complete"
  confirmations, live indicators. It deliberately contrasts red so success and
  brand emphasis are never confused.

### Implementation note

`app/globals.css` now carries these exact token values. Race Red is
`#E8112D`, the system accent Teal is `#00E0C6`, and the surface ramp is the
cool near-black listed above. Components should consume the Tailwind tokens
(`bg-surface-01`, `text-race-red`, `ring-teal`, ...) rather than re-hardcoding
hex values.

### Dark-only rule

SEPANG 56 is **dark-only**. Light/cream page backgrounds are forbidden — they
were the source of unreadable dark-on-dark controls. Every surface comes from
the Surface 01–04 ramp.

### Distribution

Aim for roughly:

- 75–85% dark neutral surfaces
- 10–20% text / neutral contrast
- about 2–5% Race Red

Red is the only dominant brand accent.

### Race Red usage

Use `#E10600` for:

- primary CTA
- active navigation underline/state
- selected prediction card
- selected circuit hotspot
- progress / lock-in emphasis
- short directional accents

Do not use red for every heading, border, icon, or background.

### Warning yellow

`#FFD100` with `#0B0B0B` text is reserved for warnings, alerts, important temporary banners, or toast states.

### Forbidden brand colors

Do not introduce lime, chartreuse, fluorescent green, neon cyan, purple, pink, or arbitrary tertiary blue as SEPANG 56 brand colors.

Green/yellow may exist only as small semantic state colors when genuinely required.

---

## 3. Exact typography

Do not substitute these fonts without explicit product approval.

### Display / headings — Barlow Condensed

Use:

- ExtraBold 800 for hero/page headlines
- Bold 700 for section titles and driver surnames
- SemiBold 600 for smaller display labels where needed

Desktop baseline:

```text
Hero H1            72px / 0.95 / 800
Page H1            56px / 0.98 / 800
Section H2         32px / 1.05 / 700
Card / Driver Name 28px / 1.0  / 700
Large Number       40px / 1.0  / 800
```

Use strong scale rather than futuristic letterforms.

### Body / UI — Titillium Web

Use:

- Regular 400
- SemiBold 600
- Bold 700

Baseline:

```text
Body Large  18px / 28px / 400
Body        16px / 24px / 400
UI Label    14px / 20px / 600
Navigation  14px / 20px / 600
Button      14px / 16px / 700 uppercase
```

Required content should generally not fall below 13px.

### Technical labels — IBM Plex Mono

Use Medium 500 or Regular 400 sparingly for metadata such as:

- `01 / 08`
- `03 / CIRCUIT`
- `SEPANG / MALAYSIA`
- `T15`
- league codes
- compact ranks / indexes

Typical size: 12–13px.

Do not use IBM Plex Mono for paragraphs, primary navigation, headings, or buttons.

### Forbidden substitutions

Do not use Orbitron, Sora, Hanken Grotesk, JetBrains Mono, or another generated substitute merely because a design tool exported it.

---

## 4. Grid and spacing

Desktop design target: `1440px` viewport.

```text
Content max width    1280px
Desktop page margin  48px
Mobile page margin   20px
Desktop grid         12 columns
Column gutter        24px
```

Use this spacing scale:

```text
4, 8, 12, 16, 24, 32, 48, 64, 96px
```

Do not introduce arbitrary spacing values unless a component genuinely requires them.

Desktop should exploit width. Mobile must recompose the layout rather than shrink desktop.

---

## 5. Geometry

Default component radius: `8px` for cards/containers, `4px` for controls.

```text
Small control / chip     2–4px
Button                   4px
Card                     8px
Large scene container    8px
Border                   1px #262D38
```

Avoid:

- large 16–24px SaaS radii
- excessive pills
- glowing borders
- default glassmorphism
- decorative chamfers everywhere

Use technical geometry sparingly and intentionally.

---

## 6. Shared application shell

All core application screens must share the same shell unless an explicitly approved immersive scene requires otherwise.

### Header

Canonical desktop header:

- background `#0A0C11` at 85% with backdrop blur
- `76px` content height plus a 3px red/white kerb stripe
- kerb stripe uses `.kerb-stripe-thin`
- left brand: `SEPANG 56`
- navigation: `LEARN`, `SEPANG`, `PREDICT`, `LEADERBOARD`
- right: context-appropriate account/action area

Do **not** add fictional or out-of-scope items such as:

- LIVE TIMING
- CIRCUIT: OPEN
- T-MINUS countdowns
- STANDINGS
- TECHNICAL
- fake system status

unless they become real approved product features later.

Active navigation uses white text with a restrained `#E10600` underline/state.

### Footer

Canonical MVP footer is quiet and structured:

- background `#0A0C11`
- chequered top edge at low opacity
- `SEPANG 56` brand block plus a one-line product description
- navigation repeat + circuit facts (`5.543 km`, `56 laps`)
- an explicit "not affiliated with Formula 1" line

Do not invent fake legal/company identity, `ALL SYSTEMS NOMINAL`, `TECHNICAL SPECS`, or fake circuit-status links.

---

## 7. Buttons

**Contrast rule (non-negotiable):** every variant hard-codes *both* its
background and its text colour. A button must never inherit a foreground
colour from its parent — that produced the black-on-black "blackout button"
bug. All states, including `:disabled`, meet at least 4.5:1.

Primary button:

```text
Background       linear-gradient(100deg, #E8112D, #FF2D46 52%, #FF7A18 140%)
Text             #FFFFFF
Height           44px (default) / 52px (large)
Horizontal pad   24px / 32px
Radius           4px
Font             Barlow Condensed 700 / 14px / uppercase / 0.08em
Shadow           0 6px 20px -6px rgba(232,17,45,0.7)
Hover            brightness(1.1), -1px translateY, light sheen sweep
```

Secondary button:

```text
Background       #141920
Border           1px #38414F
Text             #FFFFFF
Hover            border #00E0C6 (60%), background #1B212A
```

Ghost button:

```text
Background       transparent
Text             #B3BCC9  ->  #FFFFFF on hover (bg white/8%)
```

Disabled (all variants):

```text
Background       #414A58
Text             #FFFFFF at 65%
```

Focus ring for every control: `2px #00E0C6`, 2px offset.

A single directional gradient plus a hover sheen is approved for the primary
CTA. Still no pills, no neon outer glow on idle, no oversized radii.

---

## 8. shadcn/ui contract

**shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

Use shadcn/Radix primitives for accessible, systematic interaction behavior where useful, including:

- Dialog
- AlertDialog
- Sheet / Drawer
- Tooltip
- Tabs
- DropdownMenu
- Form primitives
- Progress
- Toast / Sonner
- Select where appropriate

Do not treat the default shadcn theme as the visual design.

Every shadcn component must be mapped to SEPANG 56 tokens:

- exact colors above
- Titillium Web for UI copy
- 4px geometry
- restrained borders
- no default large-radius SaaS styling

Custom identity-heavy components should remain custom:

- RaceHeader
- DriverCard
- PredictionStep
- CircuitInfoPanel
- TimingLeaderboard
- StartingLights
- SepangCircuitScene

---

## 9. Driver prediction cards

The Stitch prediction export is a baseline reference, not a literal implementation.

Canonical desktop driver card:

- four cards may sit in one row on wide desktop
- background `#111118` or image with dark neutral overlay
- border `#32323C`
- radius `4px`
- strong driver surname
- race number
- team name
- optional portrait
- team identity is a restrained rail/accent, not a full recoloring

Selected state:

- `#E10600` border or bottom rail
- explicit check/selected indicator
- optional subtle red tint
- no glow

Unselected cards should not become unreadably dark or grayscale to the point that users cannot compare options.

The card should feel like making a race pick, not betting and not selecting a character in a futuristic game.

---

## 10. Prediction page standard

Use one prediction question per primary screen.

Desktop structure:

1. shared header
2. centered content region, typically max `1120px`
3. IBM Plex Mono progress label such as `01 / 08`
4. Barlow Condensed page question such as `WHO WINS SEPANG?`
5. short Titillium Web beginner explanation
6. answer choices / driver cards
7. clear bottom action area with `NEXT`

Do not add odds, betting language, fake performance metrics, live race status, or unrelated navigation.

---

## 11. Landing page standard

The approved Stitch landing composition is a baseline:

- shared header
- left hero copy / right cinematic scene
- prominent `F1 RETURNS TO SEPANG`
- `GET RACE READY`
- four-step preview: `LEARN`, `SEPANG`, `PREDICT`, `COMPETE`

Canonical beginner copy direction:

> You don't need to know F1 to enjoy F1. Learn the basics, understand Sepang, make your picks and compete with your friends.

Remove fake `LIVE FEED`, coordinates, temperatures, technical telemetry, or system-status decoration from the final implementation unless tied to a real approved feature.

---

## 12. Sepang Explorer standard

Desktop composition:

- 8 columns: one large interactive Sepang scene
- 4 columns: selected hotspot information
- 24px gap

There must be **one primary circuit scene**, not a repeated tile gallery.

Approved hotspot navigation may include:

- `T1`
- `T4`
- `T9`
- `T15`
- `MAIN STRAIGHT`

Information panel should explain what happens and why a beginner should care.

Do not invent engineering telemetry, G-force, gear, approach speed, coordinates, or fictional statistics.

---

## 13. Three.js

Three.js is an experience layer, not the application architecture.

Only use it in the predetermined areas documented in `docs/threejs-experience.md`:

- landing cinematic scene
- selected Learn visualizations
- primary Sepang circuit explorer
- lightweight prediction/lock-in presentation where approved

Do not use Three.js for forms, auth, navigation, league creation, leaderboard tables, or ordinary UI.

Critical functionality must work without WebGL.

---

## 14. Motion

Motion should feel fast, deliberate, and mechanical.

Typical ordinary UI transition: `150–350ms`.

Prefer:

- directional entrances
- quick selection feedback
- restrained number movement
- track-path drawing
- starting-light sequencing

Avoid floaty SaaS fades, excessive spring motion, and animation that slows interaction.

Respect `prefers-reduced-motion`.

---

## 15. Mobile

Mobile is a first-class recomposition.

- page margin `20px`
- touch targets at least `44px`
- no required hover interaction
- one dominant task at a time
- cards stack or horizontally browse when appropriate
- circuit explorer becomes scene + stacked/bottom-sheet detail
- shadcn Sheet/Drawer is encouraged for mobile hotspot detail behavior
- reduce Three.js complexity/camera movement where necessary

Never implement mobile as a mechanically scaled-down desktop screenshot.

---

## 16. Accessibility and performance

- strong contrast
- status not communicated by color alone
- keyboard-accessible conventional controls
- readable body typography
- reduced-motion support
- semantic HTML under visual styling
- lazy-load heavy Three.js assets
- compressed GLB/GLTF assets
- stop/unmount offscreen WebGL work
- provide static/2D fallback when needed

---

## 17. Brand/legal boundary

SEPANG 56 is Formula-racing inspired but not an official Formula 1 product.

Do not copy official F1 logos, proprietary fonts, protected broadcast graphics one-to-one, or team assets unless usage rights are confirmed.

Use the discipline and visual language of current motorsport to create an original SEPANG 56 identity.

---

## 18. Anti-patterns

Do not produce:

- neon / cyberpunk / futuristic HUD styling
- generic SaaS dashboards
- arbitrary design-tool-generated colors/fonts
- large-radius card soup
- fake telemetry
- fake live timing/status
- excessive tiny uppercase metadata
- repeated circuit thumbnail galleries
- betting UI
- random editorial/news sections
- mobile = shrunken desktop
- pointless 3D

---

## 19. Final validation

Before approving a screen, confirm:

```text
Product             SEPANG 56
Header              #13131B
Canvas              #1A1A24
Text                #FFFFFF
Race Red            #E10600
Warning Yellow      #FFD100
Display Font         Barlow Condensed
Body/UI Font         Titillium Web
Technical Font      IBM Plex Mono
Default Radius      4px
Core Nav            LEARN / SEPANG / PREDICT / LEADERBOARD
```

Then ask:

> Does this look like a clean premium real-world motorsport product in 2026?

and:

> Can a person who knows nothing about F1 still understand the screen?

Both answers must be yes.
---

## 13. Texture & atmosphere utilities

Defined once in `app/globals.css` and reused rather than re-invented per page.

| Class | Purpose |
| --- | --- |
| `.sepang-glow` | Ambient dusk wash (sunset + teal + red radials). Sits behind page content via `PageShell glow`. |
| `.race-grid` | Faint 56px technical grid. Always paired with `.sepang-glow`. |
| `.carbon-weave` | CSS-only carbon-fibre twill. For closing/feature bands. |
| `.speed-hatch` | Angled livery hairlines. |
| `.kerb-stripe` / `.kerb-stripe-thin` | Red/white kerb edge. Section boundaries and the header top edge. |
| `.chequer` | Chequered-flag block, low opacity only. |
| `.text-gradient-heat` | White → sunset → red headline gradient. One per screen, max. |
| `.rise-in` (+ `-1..-4`) | Staggered entrance for hero content. |
| `.hero-kenburns` | Slow cinematic push on the hero photograph. |
| `.sheen` | Light sweep across primary buttons on hover. |

All of the above are disabled under `prefers-reduced-motion: reduce`.

### Page shell

Content pages must use `components/shared/page-shell.tsx` (`PageShell` +
`PageHeading`) so header, atmosphere, container width, and footer stay
identical across Learn / Sepang / Leaderboard.

### Hero imagery

`public/hero-sepang.jpg` is a dusk Sepang scene used only on the landing hero.
It must always sit under a legibility gradient — text is never placed directly
on the unmodified photograph.
