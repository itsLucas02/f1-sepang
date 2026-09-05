# SEPANG 56 — Visual Language Addendum

This document extends `DESIGN.md`. It records the surface, depth and
instrumentation primitives introduced with the hot-lap work so pages stop
inventing their own one-off treatments.

`DESIGN.md` remains authoritative for colour, type and layout tokens.

---

## 1. Depth model

SEPANG 56 is flat by default and gains depth only where the UI is *instrumental*
— overlays that float above the circuit, controls that sit above content.

Three levels only:

| Level | Use | Treatment |
| --- | --- | --- |
| Base | Page sections | Surface 01–02, 1px `--sepang-border`, no shadow |
| Raised | Editorial cards, driver cards | `.surface-card`: top edge highlight, hover lift of 3px, long soft shadow |
| Floating | Telemetry overlays, transport controls, tooltips | `.glass-panel`: blurred dark glass, inner top highlight, deep shadow |

Do not stack more than two levels in one composition.

---

## 2. Shared CSS primitives

Defined once in `app/globals.css`:

- `.glass-panel` — frosted instrument panel (blur 16px, dark tint, inset highlight).
- `.surface-card` — raised editorial card with lit top edge and hover lift.
- `.edge-accent` — red→sunset underline that wipes in on hover/focus-within.
- `.live-dot` — teal system indicator with a pulsing ring. Teal, never red.
- `.scene-label` — mono chip used for labels rendered inside the WebGL scene.
- `.hot-lap-scrub` — range-input skin for the lap transport.
- `.marquee` / `.marquee-slow` — ticker band; pauses on hover, disabled under reduced motion.
- `.scroll-rail` — reading progress rail pinned under the sticky header.
- `.ambient-wash` — very low-opacity red/sunset/teal radial wash behind sections.
- `.rule-glow` — divider with a bright centre.
- `.text-gradient-heat` — headline treatment, race red bleeding into sunset.

If a page needs a new decorative treatment, add it here first.

---

## 3. Colour doctrine

The theme is the sport's own graphic language, not a mood board.

**Rule 1 — no decorative gradients.** Broadcast and team graphics are hard
edged: flat fills, sharp diagonals, one accent. Colour ramps are permitted only
for (a) photographic scrims and (b) data heat, never for type, rules, bars,
underlines or chrome. The old red→sunset headline ramp and the red→orange→amber
progress bars were removed for this reason.

**Rule 2 — one red.** Race Red `#E8112D` is the only brand colour. It marks the
active thing and nothing else.

**Rule 3 — the timing palette is data, not decoration.** F1 timing screens speak
in three colours, and so do we:

| Colour | Token | Meaning |
| --- | --- | --- |
| Purple `#B026FF` | `timing-purple` | Fastest — the quickest sector of the lap |
| Green `#00D26A` | `timing-green` | Live / best / throttle |
| Yellow `#FFD800` | `timing-yellow` | Slower / caution |

Sector colours are **derived, not assigned**: `SEPANG_SECTOR_COLORS` ranks the
three sector times and hands out purple, green and yellow accordingly. If the
model changes, the colours follow the data.

**Rule 4 — chequer, not stripes.** Red-and-white repeating diagonals read as a
barber pole. The finish-line motifs (`.kerb-stripe`, `.kerb-stripe-thin`,
`.chequer`) are chequered flag blocks in bone on near-black. Red/white kerbing
survives only in the 3D scene, where it is the actual track furniture.

The speed ramp is deep red → race red → coral → bone. No orange.

## 4. Instrumentation language

Anything that displays derived lap data follows the same rules:

- numbers are mono or display-italic, always `tabular-nums`
- units are 8–9px mono in `text-white/40`
- the label "simulated" or "derived" is always visible in the same panel
- sector colours are ranked from the data (purple / green / yellow), never fixed
- the speed ramp runs `#7C0A1A` → `#E8112D` → `#FF6C7C` → bone `#F6F6F0`
- throttle is timing green, braking is race red — everywhere, without exception

Team identity colours (`content/drivers.ts`) are accents only: a 3px stripe, a
car number, a hover wash. Never a large flat fill.

---

## 5. Motion budget

- Entrances: 320–520ms, `cubic-bezier(0.22, 1, 0.36, 1)`, one axis only.
- Hover: 200–300ms, max 3px lift, no scale above 1.06 on imagery.
- Camera moves in 3D: 950ms eased, or instant under reduced motion.
- Continuous animation is allowed only for: the hot lap, the ticker, the live
  dot, and the hero Ken Burns. Everything else animates on interaction.
- High-frequency values (speed, gear, lap clock, scrub position) are written
  straight to the DOM from `requestAnimationFrame`. Never re-render React at
  frame rate.
- Every continuous animation must stop under `prefers-reduced-motion: reduce`.

---

## 6. The circuit model

The 3D circuit is a raised slab, not a line. Proportions live in
`lib/circuit-geometry.ts` and the 2D map mirrors them:

| Layer | Width (scene units) | Colour |
| --- | --- | --- |
| Ground plane | 38 x 38 | radial wash `#161B23` → `#08090C` |
| Run-off apron | 0.62 | `#1A1F27` |
| Slab side walls | — (0.09 tall) | `#0E1218` |
| Asphalt top face | 0.34 | `#363C47` |
| Painted edge lines | 0.022 each side | `#ECEAE4` at 80% |
| Kerbing (corners only) | 0.06 each side | red / bone, alternating |
| Racing line | 0.05 | speed ramp |
| Trackside posts | every ~70 m | `#8B95A4`, red on corners |

**Everything in the circuit model is unlit** (`meshBasicMaterial`). Lit dark
surfaces are crushed to black by the renderer's tone mapping, which previously
left the asphalt invisible while the unlit kerbs stayed vivid — the track read
as stripes floating in a void. Lights in the scene exist only for the car.

Camera field of view carries the mode: 34° overview, 38° corner, 62° onboard.

Orientation rule: the source SVG's **y axis maps to scene +z**. Negating it
mirrors Sepang — the layout still looks plausible but is wrong, and it is
guarded by a signed-area test in `lib/circuit-geometry.test.ts`.

## 7. Accessibility guardrails

- The 3D scene is decorative: it carries `role="img"` plus a text description,
  and every hotspot it exposes is also reachable from `CircuitHotspotTabs`.
- Focus rings are timing green (`--sepang-teal`, now `#00D26A`) at 2px with a 3px offset.
- Controls in overlays keep a 40px minimum hit area.
- Colour is never the only signal: selected states also change border, label
  weight, or add a check mark.
