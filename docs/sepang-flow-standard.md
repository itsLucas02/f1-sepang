# SEPANG 56 — Understand Sepang Flow Standard

## Status

**Finalized product flow.**

This document is the source of truth for the MVP `Understand Sepang` experience. It defines entry behavior, guided/free exploration, hotspot interaction, progress, and transition into Predictions.

Detailed educational copy for each hotspot is not yet finalized. Circuit facts must be verified before production copy is locked.

---

## Purpose

Understand Sepang turns general F1 knowledge into circuit-specific understanding.

The experience should answer two beginner questions at every important location:

1. **What happens here?**
2. **Why does it matter when I watch the race?**

The explorer is visual-first and location-driven.

Core loop:

```text
SELECT A PLACE
   ↓
SEE IT ON THE CIRCUIT
   ↓
UNDERSTAND WHAT HAPPENS THERE
   ↓
UNDERSTAND WHY IT MATTERS
```

---

## Entry flow

Users may enter from Learn, Landing/navigation, or a returning session.

### First visit

```text
MEET SEPANG
   ↓
SHORT CIRCUIT INTRODUCTION
   ↓
START GUIDED TOUR
   ↓
CIRCUIT EXPLORER
```

The user may skip the guided tour and choose **Explore Freely**.

### Returning visit

```text
SEPANG
   ↓
OPEN CIRCUIT EXPLORER
   ↓
FREE EXPLORE
```

Do not replay the first-visit introduction on every visit.

Restoring the last selected hotspot is allowed if it improves continuity.

---

## Approved hotspot set

The MVP explorer contains exactly these five locations:

1. **Main Straight**
2. **T1**
3. **T4**
4. **T9**
5. **T15**

Do not independently add more circuit hotspots during MVP implementation.

---

## Recommended guided-tour order

For a first-time user, recommend this sequence:

```text
MAIN STRAIGHT
     ↓
T1
     ↓
T4
     ↓
T9
     ↓
T15
```

This is a guided educational route, not a lap simulation or engineering tool.

The user may leave the order and select another hotspot at any time.

---

## Hotspot interaction

Selecting a hotspot updates application state first.

Example:

```ts
selectedHotspot = "T15"
```

The selected state then drives both presentation layers:

```text
HOTSPOT SELECTED
      ↓
React application state updates
      ↓
┌───────────────────────┬─────────────────────────┐
│ Three.js scene        │ CircuitInfoPanel        │
│                       │                         │
│ Reframe camera        │ Show hotspot title      │
│ Highlight section     │ What happens here?      │
│ Show selected marker  │ Why it matters          │
└───────────────────────┴─────────────────────────┘
```

### Architecture rule

**Three.js displays product state. Three.js does not own product state.**

Business/navigation state must remain outside the WebGL scene.

---

## Information-panel structure

Every hotspot uses the same beginner-friendly content hierarchy:

```text
03 / CIRCUIT

TURN 15

WHAT HAPPENS HERE?
Short plain-English explanation.

WHY IT MATTERS
What the user should watch for during the race.
```

The exact index label may change to reflect the selected hotspot, but the information hierarchy remains consistent.

Avoid engineering-dashboard presentation.

---

## Progress

Opening a hotspot marks it as visited.

Suggested state:

```ts
type SepangState = {
  hasVisitedSepang: boolean
  tourMode: "guided" | "free"
  selectedHotspot: HotspotId
  visitedHotspots: Set<HotspotId>
  sepangReady: boolean
}
```

`sepangReady` becomes true when all five recommended hotspots have been visited.

Example:

```ts
const sepangReady = recommendedHotspots.every(
  (hotspot) => visitedHotspots.has(hotspot)
)
```

---

## Sepang Ready

When all recommended locations have been explored, show a lightweight milestone:

```text
YOU KNOW SEPANG

You know the key places to watch.

[ MAKE YOUR PICKS → ]
```

This is encouragement, **not a hard gate**.

Users may continue to Predictions before all five hotspots have been visited.

---

## Desktop behavior

Desktop should preserve simultaneous spatial and explanatory context.

Approved composition:

```text
┌───────────────────────────────────────────────┐
│ SEPANG INTERNATIONAL CIRCUIT                 │
├─────────────────────────────┬─────────────────┤
│                             │ 03 / CIRCUIT    │
│                             │                 │
│     THREE.JS CIRCUIT        │ TURN 15         │
│                             │                 │
│                             │ What happens... │
│                             │                 │
│                             │ WHY IT MATTERS  │
├─────────────────────────────┤                 │
│ T1  T4  T9  T15  STRAIGHT  │                 │
└─────────────────────────────┴─────────────────┘
```

Selecting a hotspot updates the same scene and information panel without a page reload.

Follow the detailed responsive/component rules in:

- `docs/ui-standardization.md`
- `docs/threejs-experience.md`

---

## Mobile behavior

Mobile prioritizes the circuit before explanation.

Approved order:

```text
SEPANG INTERNATIONAL CIRCUIT

┌─────────────────────┐
│                     │
│   THREE.JS CIRCUIT  │
│                     │
└─────────────────────┘

T1 | T4 | T9 | T15 | MAIN STRAIGHT

03 / CIRCUIT
TURN 15

WHAT HAPPENS HERE?
...

WHY IT MATTERS
...
```

Do not squeeze the desktop side-by-side layout onto mobile.

Follow `docs/mobile-circuit-standard.md` for exact mobile composition and design behavior.

A sheet/bottom-sheet pattern may be used where it materially improves interaction, but the circuit must remain the primary visual context.

---

## Content boundaries

The explorer is for beginner race understanding, not fake race engineering.

Do not add:

- live telemetry
- live timing
- fake track temperature
- fake entry speed
- fake G-force
- fake coordinates
- gear readouts
- aero-balance dashboards
- driver GPS
- lap simulation
- telemetry CTAs
- technical-spec dashboards

If a real factual metric is later desired, it must be explicitly approved and sourced rather than invented for visual decoration.

---

## Hotspot copy status

The five hotspot identities and interaction model are finalized.

The final factual educational copy for:

- Main Straight
- T1
- T4
- T9
- T15

is **not yet locked**.

Before production content is finalized, verify circuit-specific claims using reliable sources. Do not treat Stitch placeholder text as factual authority.

---

## Transition to Predictions

The primary next action is:

**MAKE YOUR PICKS →**

The transition may appear:

- after the full guided tour
- after `Sepang Ready`
- as a non-blocking option during free exploration

Do not require `sepangReady === true` before allowing Predictions.

---

## Implementation boundary

The approved product loop is:

```text
First visit / Free entry
      ↓
Circuit Explorer
      ↓
Select hotspot
      ↓
Three.js focus + explanation
      ↓
Mark visited
      ↓
Explore more OR Make Your Picks
```

If implementation requires changing that loop, update this document before coding the change.
