# SEPANG 56 — Mobile Prediction Standard

This document standardizes the approved Google Stitch mobile Prediction reference into the canonical SEPANG 56 design system.

The Stitch mobile Prediction HTML is a **strong composition and interaction baseline**. Preserve its successful layout and card treatment. Do not rewrite it merely for the sake of being different. Standardize only the generated tokens, font substitutions, implementation details, and accessibility/state behavior that conflict with `DESIGN.md`.

`DESIGN.md` remains authoritative for colors, typography, geometry, spacing, and brand rules.

## 1. What from Stitch is approved

Preserve these ideas from the exported mobile Prediction screen:

- focused transactional header with back button and centered `SEPANG 56`
- `01 / 08` progress chip
- strong `WHO WINS SEPANG?` heading
- short helper copy
- two-column mobile driver grid
- compact text-first driver cards
- small team label above the driver surname
- oversized faded race number anchored toward the lower-right of each card
- selected state expressed through a red border and restrained red tint
- sticky/full-width bottom `NEXT` action
- no normal application footer during the focused prediction flow

The overall Stitch composition is approved. Production implementation should feel recognizably like this reference.

## 2. What must be standardized

Do not preserve Stitch-generated implementation details that conflict with the repo design contract.

### Replace generated fonts

Stitch exported Hanken Grotesk for body/UI. Production must use:

```text
Display / headings    Barlow Condensed
Body / UI             Titillium Web
Technical metadata    IBM Plex Mono
```

Do not use Hanken Grotesk.

### Replace generated red

Stitch uses `#E90B18` in places. Production Race Red is exactly:

```text
#E10600
```

Use `#E10600` for selected card border/tint, progress emphasis, focus accents where appropriate, and the primary `NEXT` action.

### Remove generated palette clutter

Do not carry Stitch's brown/rose/blue Material-style tokens into production.

Use only the canonical SEPANG 56 roles:

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

## 3. Focused mobile flow header

Prediction steps use a focused transactional header rather than the full mobile navigation shell.

Create/reuse a `RaceFlowHeader` variant:

```text
Background       #13131B
Bottom border    #32323C
Min height       56px
Left             Back control
Center           SEPANG 56
Right            balancing spacer or future approved action
```

Back control:

- minimum 44x44px touch target
- accessible label
- visible focus state

Center label may use IBM Plex Mono or a restrained Titillium Web treatment. It should remain intentionally quieter than the page heading.

Do not add live timing, countdowns, circuit status, or other navigation/status clutter inside this focused flow.

## 4. Prediction step content

Mobile page margin: `20px`.

Structure:

```text
RaceFlowHeader
PredictionStep
├── progress chip
├── question heading
├── helper copy
├── two-column answer grid
└── sticky action area
```

### Progress chip

Example:

`01 / 08`

Use:

- IBM Plex Mono 500
- 12px
- Race Red text or restrained red emphasis
- Surface 03 / neutral background
- 1px Border
- 4px radius

### Question heading

Example:

`WHO WINS SEPANG?`

Use:

- Barlow Condensed 800
- approximately 32–38px on mobile depending on viewport
- white
- compact line height

### Helper copy

Example:

`Choose the driver you think will finish P1.`

Use:

- Titillium Web 400
- 16–18px
- Text Secondary

## 5. Mobile DriverCard

The Stitch text-first card design is approved.

Do **not** force desktop portrait-heavy cards onto mobile.

Canonical anatomy:

```text
DriverCardMobile
├── team label
├── driver surname
├── large faded race number
└── selection state
```

Base styling:

```text
Background       #111118
Border           1px #32323C
Radius           4px
Padding          16px
Min height       about 104–120px
Width            full grid cell
```

The entire card is one interactive button/control.

### Team label

Preserve the small uppercase team-label treatment from Stitch.

This is a content field, not a new visual component. The exact label text should come from the canonical driver/team data source during implementation rather than being hard-coded independently in each screen.

Use:

- IBM Plex Mono 400/500
- 11–12px
- Text Muted

### Driver surname

Use:

- Barlow Condensed 700
- approximately 24px
- white
- uppercase

### Race number

Preserve Stitch's oversized ghost-number treatment.

Use:

- Barlow Condensed 800
- approximately 56–64px
- low opacity
- anchored toward lower-right
- clipped by the card if visually useful

It must remain decorative and must not reduce surname readability.

### Selected state

Preserve the Stitch concept:

- border becomes `#E10600`
- optional subtle red tint around 4–6% opacity
- race number may gain restrained red emphasis
- explicit selected state should also be available to assistive technology

No glow.

### Unselected state

Keep cards clearly readable. Do not dim them so much that users cannot compare choices.

### Focus state

Keyboard/focus-visible state must be distinguishable from selection state.

Use an accessible ring/border treatment derived from `#FFFFFF` / `#E10600` without neon glow.

## 6. Two-column mobile grid

The Stitch two-column layout is approved for typical mobile widths.

```text
Columns        2
Gap            16px
Page margin    20px
```

At very narrow widths where legibility breaks, implementation may fall back to one column rather than shrinking typography below the design minimums.

Do not convert this screen into horizontal swipe cards unless explicitly approved later.

## 7. Sticky NEXT action

Preserve Stitch's sticky bottom action pattern.

The action region should account for mobile safe-area insets.

Primary button:

```text
Label          NEXT
Background     #E10600
Text           #FFFFFF
Min height     48px
Width          100%
Radius         4px
Font           Titillium Web 700 / 14px / uppercase
```

Behavior:

- disabled until a valid choice exists
- enabled once one driver is selected
- single selection only for this question
- arrow icon is optional
- no gradient on the button itself

A subtle canvas-to-transparent backdrop behind the sticky action area is acceptable if it prevents content collision, but it must use canonical canvas colors.

## 8. Interaction/state model

Do not reproduce Stitch's inline `onclick` JavaScript in production.

Production should use React state and reusable components.

Conceptually:

```text
PredictionStep
  selectedDriverId
       ↓
DriverCardMobile x N
       ↓
NEXT enabled/disabled
```

Single-select behavior:

1. user taps a card
2. previous selection clears
3. selected card receives canonical selected state
4. `NEXT` becomes enabled
5. action advances to the next prediction step

Prediction/business state must remain outside visual card internals.

## 9. Data/content rule

The Stitch driver names, teams, numbers, and season assignments are visual placeholder/reference content and must not become the canonical dataset automatically.

Production implementation should load all driver/team labels and numbers from one canonical project data source.

The visual card format stays the same regardless of the eventual data source.

## 10. shadcn relationship

The DriverCard itself remains a custom SEPANG 56 identity component.

Use shadcn/Radix only where behavior helps, for example:

- AlertDialog for final lock-in confirmation
- Progress if a later step-progress treatment benefits from it
- Toast/Sonner for saved/error feedback

Do not replace the approved custom card design with stock shadcn `Card` styling.

**shadcn gives us the behavior. SEPANG 56 gives it the F1 skin.**

## 11. Mobile-only relationship to desktop

The desktop and mobile prediction cards are allowed to differ in composition.

Desktop may use richer portrait-led cards.

Mobile uses the approved compact text-first two-column cards.

This is intentional responsive recomposition, not inconsistency.

Shared between both:

- canonical colors
- canonical typography
- 4px geometry
- selection semantics
- driver/team data source
- prediction state model

## 12. Final validation

Before approving the mobile Prediction implementation, confirm:

- focused back-button header is preserved
- `01 / 08` progress remains visible
- two-column card layout remains recognizable from Stitch
- ghost race numbers remain
- selected card uses `#E10600`, not Stitch's old red
- body/UI uses Titillium Web, not Hanken Grotesk
- card heading uses Barlow Condensed
- metadata uses IBM Plex Mono
- canvas is `#1A1A24`
- surfaces use canonical SEPANG tokens only
- no generated brown/rose/blue token system remains
- `NEXT` is sticky/full-width and safe-area aware
- selected state is accessible
- no footer or pseudo-live status clutter is introduced
- production state uses reusable React components, not inline Stitch JavaScript

The objective is to preserve the strong Stitch mobile Prediction design while making its implementation systematic, reusable, accessible, and consistent with the rest of SEPANG 56.
