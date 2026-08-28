# SEPANG 56 — Component Architecture Contract

## Status

**Finalized implementation architecture.**

This document defines how shadcn/ui, Radix primitives, SEPANG 56 custom components, feature components, and pages must relate to each other.

The purpose is to remove implementation ambiguity without turning the product into a stock shadcn application.

The governing principle is:

> **shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

---

## 1. Architecture layers

Implement the UI in four conceptual layers:

```text
Radix / shadcn interaction primitives
                ↓
SEPANG shared components
                ↓
Feature components
                ↓
Pages / product flows
```

Each layer has a different responsibility.

### Layer 1 — Radix / shadcn primitives

Own reusable interaction behavior such as:

- accessibility semantics
- keyboard interaction
- focus management
- selection behavior
- dialogs and overlays
- menus
- drawers/sheets
- tooltips
- form primitives
- progress primitives
- toast behavior

They do **not** define the visible identity of SEPANG 56.

### Layer 2 — SEPANG shared components

Own the reusable visual language and application shell.

Examples:

- `RaceHeader`
- `RaceFlowHeader`
- `RaceFooter`
- buttons / control styling wrappers where useful
- shared page/container primitives
- warning/toast presentation

These components use exact tokens from `DESIGN.md`.

### Layer 3 — Feature components

Own product-specific interactions and visual identity.

Examples:

- `FamiliarityCard`
- `LessonStep`
- `RaceReadyMoment`
- `DriverCard`
- `PredictionStep`
- `CircuitHotspotTabs`
- `CircuitInfoPanel`
- `SepangCircuitScene`
- `StartingLights`
- `TimingLeaderboard`

These may use Radix/shadcn behavior internally, but their public component identity is SEPANG 56.

### Layer 4 — Pages / product flows

Pages compose the shared and feature components according to finalized product-flow documents.

Pages should not recreate shared interaction behavior or restyle primitives ad hoc.

---

## 2. Core selection rule

Never choose a shadcn component because its default appearance resembles the desired interface.

Choose a shadcn/Radix primitive **only when its interaction model matches the required behavior**.

Bad reasoning:

> This looks like a card, so use shadcn `Card`.

Good reasoning:

> Only one driver may be selected, so use `RadioGroup` semantics underneath our custom `DriverCard` presentation.

A rectangular SEPANG component is not automatically a shadcn `Card`.

---

## 3. Visual ownership

The following are authoritative for appearance:

1. `DESIGN.md`
2. `docs/ui-standardization.md`
3. approved responsive standards
4. approved Stitch composition references

shadcn defaults are **never** a visual source of truth.

All shadcn/Radix-backed components must inherit SEPANG 56 tokens, including:

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
Default Radius       4px
```

Typography roles:

```text
Display / Headings    Barlow Condensed
Body / UI             Titillium Web
Technical Metadata    IBM Plex Mono
```

Do not allow generated shadcn styles, CSS variables, or theme presets to reintroduce arbitrary gray, blue, purple, brown, glass, large-radius, or generic SaaS styling.

---

## 4. Primitive-to-product mapping

### Mobile navigation

Use:

```text
shadcn Sheet / Radix Dialog behavior
                 ↓
RaceHeader mobile menu presentation
```

The user sees SEPANG 56 navigation, not a stock Sheet demo.

Approved destinations remain:

- LEARN
- SEPANG
- PREDICT
- LEADERBOARD

---

### Familiarity check

Use radio-group semantics for the three mutually exclusive knowledge levels.

```text
RadioGroup behavior
       ↓
FamiliarityCard × 3
```

`FamiliarityCard` owns:

- visual hierarchy
- selected red treatment
- copy
- responsive layout
- SEPANG typography and geometry

The primitive owns:

- one-selection-only behavior
- keyboard navigation
- focus semantics
- ARIA selection state

Do not present stock radio circles unless explicitly useful to the design.

---

### Learn progress

A progress primitive may be used where useful, but the Race Ready milestone must remain a custom product moment.

```text
Progress behavior (optional)
       ↓
Lesson progress presentation

Custom RaceReadyMoment
```

Do not turn Learn into a generic stepper/dashboard component library demo.

---

### F1 terminology help

Use Tooltip where short clarification genuinely improves comprehension.

```text
Tooltip behavior
      ↓
SEPANG-styled jargon explanation
```

Tooltips must not be the only way essential information is available on touch devices.

---

### Circuit hotspot selection

`CircuitHotspotTabs` is a SEPANG feature component.

It may use Radix Tabs or equivalent roving-focus behavior internally if that interaction model fits.

```text
Tabs / roving-focus behavior
          ↓
CircuitHotspotTabs
          ↓
selectedHotspot application state
          ↓
SepangCircuitScene + CircuitInfoPanel
```

Approved hotspots:

- `T1`
- `T4`
- `T9`
- `T15`
- `MAIN STRAIGHT`

The visible hotspot controls must use the exact SEPANG tokens and geometry.

---

### Mobile circuit detail

The default approved mobile composition remains scene → hotspot selector → stacked details as specified in `docs/mobile-circuit-standard.md`.

If a bottom-sheet presentation is intentionally used for a constrained viewport or a future interaction mode, use Drawer/Sheet behavior rather than building custom overlay mechanics.

```text
Drawer / Sheet behavior
          ↓
CircuitInfoPanel content
```

Do not introduce a Drawer merely because shadcn provides one. The product layout determines whether it is needed.

---

### Prediction driver selection

The approved Stitch-derived `DriverCard` design remains custom.

Use radio-group semantics underneath single-answer driver questions:

```text
RadioGroup behavior
       ↓
DriverCard × N
```

`DriverCard` owns:

- team label
- surname
- race number
- portrait treatment on layouts where approved
- text-first mobile treatment where approved
- selected red state
- focus presentation
- responsive adaptation

Do **not** replace `DriverCard` with generic shadcn `Card` markup just because it is card-shaped.

---

### Prediction shell

`PredictionStep` is custom and owns the product composition:

```text
PredictionStep
├── progress label
├── question heading
├── beginner explanation
├── answer region
└── action region
```

Question-specific answer controls may be powered by appropriate Radix/shadcn primitives underneath.

Examples:

- one driver → RadioGroup
- yes/no → RadioGroup or ToggleGroup semantics where appropriate
- confirmation → AlertDialog only when a real irreversible/consequential action requires confirmation

Do not make every Next action open a Dialog.

---

### Pick locking / confirmation

Use `AlertDialog` only when the product has a finalized lock action that meaningfully changes editability or persistence.

The lock rule itself is product logic and must come from the finalized Prediction flow, not from the component library.

`StartingLights` remains a custom presentation component and may be used for the approved lock-in ceremony.

```text
AlertDialog behavior where needed
           +
custom StartingLights presentation
```

---

### Auth and forms

Use established form primitives for:

- sign in
- account creation
- league name
- join code
- profile inputs where approved

Use shadcn/Radix behavior for labels, validation, Select, Dialog, etc. where useful.

Do not build custom form infrastructure for visual uniqueness.

The forms still use SEPANG 56 colors, fonts, borders, focus states, and 4px geometry.

---

### Leagues

When league mechanics are finalized:

- Dialog may support compact create/join actions where product flow calls for it
- Form/Input can support league name and join code
- Tooltip may explain unfamiliar concepts
- Toast/Sonner may confirm non-critical actions

`TimingLeaderboard` remains custom because it is a high-identity product component.

Do not use a generic shadcn Table as the visible identity by default. Accessible table semantics may be used under the custom presentation where appropriate.

---

### Toasts and warnings

Use Sonner/shadcn behavior where useful.

Standard visual treatment:

```text
Normal temporary feedback
- SEPANG neutral surfaces
- canonical typography
- restrained borders

Warning / important notice
- background #FFD100
- text/icon #0B0B0B
- radius 4px
```

Yellow is not a general brand accent.

---

## 5. Components that must remain custom

These components are part of the recognizable SEPANG 56 product identity and must not be replaced by stock-looking shadcn equivalents:

- `RaceHeader`
- `RaceFlowHeader`
- `RaceFooter`
- `JourneyStepCard`
- `FamiliarityCard`
- `LessonStep`
- `RaceReadyMoment`
- `DriverCard`
- `PredictionStep`
- `CircuitHotspotTabs`
- `CircuitInfoPanel`
- `SepangCircuitScene`
- `StartingLights`
- `TimingLeaderboard`
- approved Learn visual components

A custom component may still use a Radix primitive internally.

---

## 6. Three.js boundary

shadcn/Radix does not own the Three.js experience.

`SepangCircuitScene` and approved learning/landing 3D scenes remain custom React Three Fiber / Three.js components.

Three.js receives application state; it does not own product state.

Example:

```text
React product state
selectedHotspot = "T15"
       ↓
SepangCircuitScene receives selectedHotspot
       ↓
scene reframes camera / highlights T15
```

Overlay controls may use normal SEPANG controls or appropriate shadcn-backed behavior, but WebGL business/navigation state must remain outside the scene.

---

## 7. Suggested code organization

Exact directory names may adapt to the chosen Next.js structure, but preserve these responsibility boundaries.

Example:

```text
components/
├── ui/                    # installed/customized shadcn primitives
├── sepang/                # shared SEPANG visual primitives/shell
│   ├── race-header.tsx
│   ├── race-flow-header.tsx
│   └── race-footer.tsx
├── learn/
│   ├── familiarity-card.tsx
│   ├── lesson-step.tsx
│   └── race-ready-moment.tsx
├── circuit/
│   ├── circuit-hotspot-tabs.tsx
│   ├── circuit-info-panel.tsx
│   └── sepang-circuit-scene.tsx
├── prediction/
│   ├── driver-card.tsx
│   ├── prediction-step.tsx
│   └── starting-lights.tsx
└── leaderboard/
    └── timing-leaderboard.tsx
```

`components/ui/` is infrastructure, not the product identity layer.

Do not scatter modified copies of the same shadcn primitive throughout feature directories.

---

## 8. Accessibility contract

Using Radix/shadcn does not remove implementation responsibility.

Every feature must still verify:

- visible keyboard focus
- selection not communicated by color alone
- minimum approximately 44px touch targets where relevant
- meaningful accessible names
- logical reading/focus order
- reduced-motion support
- mobile interactions that do not depend on hover
- Three.js fallback does not remove core content/actions

Custom wrappers must not break the accessibility behavior provided by the underlying primitive.

---

## 9. Anti-patterns

Do not:

- import the default shadcn look as the project identity
- use large default SaaS radii
- wrap every content block in a generic `Card`
- use Dialog for ordinary navigation
- use Drawer because it happens to exist
- use Tabs when simple buttons are semantically clearer
- create one-off primitive styling per page
- mix shadcn typography with the SEPANG typography system
- let a generated component introduce arbitrary colors
- replace approved Stitch-derived custom composition with generic component-library composition
- make Three.js depend directly on Dialog/Tabs/business state internals

---

## 10. Decision test for implementers

Before adding a shadcn/Radix primitive, answer:

1. **What interaction behavior do we need?**
2. **Does this primitive correctly model that behavior?**
3. **Can the visible UI remain fully SEPANG 56?**
4. **Does the primitive improve accessibility/reliability enough to justify it?**

If the only answer is "it looks similar," do not use it for that reason.

---

## 11. Final implementation rule

Codex/OpenCode should treat shadcn/Radix as an **engineering foundation**, not as a design kit.

The intended relationship is:

```text
shadcn / Radix = behavior + accessibility
Stitch references = approved composition inspiration
DESIGN.md = visual authority
SEPANG custom components = product identity
flow standards = product behavior authority
```

Do not collapse these responsibilities into one layer.
