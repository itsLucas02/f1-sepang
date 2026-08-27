# SEPANG 56 — Design System Contract

This file is the visual source of truth for SEPANG 56. It is written for both design exploration tools such as Google Stitch and implementation agents such as Codex/OpenCode.

Codex/OpenCode must implement this system; they must not independently reinterpret the product's visual direction. Google Stitch may explore compositions within this system, but should not replace the system with a different brand direction.

For exact approved 3D scene behavior, read `docs/threejs-experience.md`.

---

## 1. Design north star

SEPANG 56 should feel like a **premium modern motorsport product built for race weekend**: clean, technical, fast, highly legible, and unmistakably racing-oriented.

The experience should combine the disciplined cleanliness of professional motorsport interfaces with a dark race-control atmosphere and selective cinematic 3D moments.

### SEPANG 56 is

- premium
- motorsport-first
- precise
- energetic
- technical
- cinematic where appropriate
- Malaysian
- beginner-friendly
- highly legible

### SEPANG 56 is not

- generic SaaS
- cyberpunk
- neon gaming UI
- cartoon racing
- glassmorphism-heavy
- cluttered esports UI
- an imitation of official Formula 1 branding
- telemetry cosplay on every screen

The interface may look technical, but it must remain understandable to someone who knows zero F1.

---

## 2. Core visual blend

Use a deliberate blend of three visual languages:

1. **Professional motorsport interface** — disciplined grids, timing/classification structures, position numbers, track linework, race-state signals, strong alignment.
2. **Premium racing presentation** — starting-light moments, driver-selection energy, cinematic framing, controlled Three.js scenes.
3. **Premium editorial design** — confident spacing, strong typography, large hierarchy, uncluttered storytelling.

The product should feel clean first and dramatic second.

Do not make every screen cinematic. Conventional product screens should remain disciplined and efficient.

---

## 3. Theme

### Dark mode is the primary and only required MVP theme

Do not build a light theme for MVP unless explicitly requested later.

The visual foundation should feel like asphalt, race control, pit garage, and modern broadcast hardware rather than pure black-on-red gaming UI.

### Baseline color direction

These values are the current design baseline. Stitch may suggest small refinements, but must preserve the hierarchy and roles.

```text
Canvas / Background      #08080C
Surface 01               #111118
Surface 02               #181820
Surface 03               #22222B
Border / Divider         #32323C

Text Primary             #F7F7F7
Text Secondary           #B7B7BF
Text Muted               #777781

Race Red                 #E90B18
Signal Green             #24A148
Signal Yellow            #F5C400
Disabled                  #60616B
```

Aim approximately for **90% dark neutral surfaces and 10% deliberate color**.

SEPANG 56 must not become an all-red website.

---

## 4. Racing red

Race Red is the primary brand/action accent.

Use it for:

- primary CTAs
- selected states
- active navigation
- progress emphasis
- lock-in moments
- important race-state emphasis
- short directional accents

Do not use it for:

- every heading
- every border
- every icon
- large decorative background areas by default
- every card

Red should retain meaning and visual authority.

---

## 5. Team colors

Team colors are contextual, not part of the core SEPANG 56 palette.

They may appear in:

- driver cards
- race numbers
- thin identity rails/stripes
- selected prediction states
- prediction summaries
- leaderboard identifiers where useful

Team colors should never overpower the dark SEPANG 56 system.

A driver card should still look like SEPANG 56 first and a team card second.

Do not rely on team color alone to identify a driver/team.

---

## 6. Typography system

Typography is a primary brand device.

### Display / motorsport

Preferred direction: **Orbitron** or a comparable legally usable squared/geometric display face.

Use for:

- `SEPANG 56`
- hero headlines
- page titles
- major section titles
- oversized race numerals
- cinematic state labels such as `LIGHTS OUT` and `PICKS LOCKED`

Do not use the display face for long paragraphs or dense controls.

### Body / UI

Preferred direction: **Titillium Web**.

Use for:

- educational explanations
- navigation
- buttons
- forms
- general UI labels
- longer readable content

If implementation constraints require an alternative, choose a similarly clean, condensed-leaning modern sans rather than a generic rounded startup font.

### Telemetry / technical labels

Use a restrained monospace or condensed technical face when it adds clarity. A font such as IBM Plex Mono is an acceptable direction.

Use sparingly for:

- `P01`
- `T15`
- `LAP 56`
- league codes
- ranks
- scores
- timestamps
- small technical metadata

Use tabular numerals where possible.

### Typography behavior

Favor:

- strong numeric hierarchy
- uppercase micro-labels
- compact technical metadata
- large readable driver surnames
- short decisive headings
- restrained tracking in display typography
- bold position/rank numbers

Example visual hierarchy:

```text
03 / CIRCUIT

TURN 15
THE FINAL CORNER

HIGH-SPEED ENTRY
OVERTAKING OPPORTUNITY
```

Do not copy official Formula 1 proprietary fonts.

---

## 7. Layout philosophy

The underlying layout should be disciplined and clean even when the experience feels cinematic.

Favor:

- strong grids
- clear alignment
- wide content regions on desktop
- confident negative space
- horizontal rails/dividers
- asymmetry when useful
- large numeric section markers such as `01`, `02`, `56`
- full-width scene moments where appropriate
- split layouts for visual + contextual information

Avoid:

- endless centered hero/card layouts
- every element floating independently
- random diagonals with no purpose
- excessive decorative racing stripes

### Desktop

Desktop should exploit width rather than simply enlarge mobile components.

Approved patterns include:

- scene + side information panel
- wide prediction grids
- broad timing/classification layouts
- cinematic negative space
- simultaneous visual and context

### Mobile

Mobile is a **recomposition**, not a shrunken desktop layout.

Favor:

- vertical storytelling
- one dominant interaction at a time
- bottom sheets for contextual 3D information
- stacked scene + detail arrangements
- sticky/fixed actions where useful
- large touch targets
- condensed timing/classification layouts

Never rely on hover for required functionality.

Required mobile touch targets should generally be at least 44px.

---

## 8. Geometry

The system should feel technical and engineered without becoming visually aggressive.

### Default geometry

- mostly rectangular panels
- squared or small-radius containers
- baseline corner radius: approximately `2px–6px`
- thin borders/dividers on dark surfaces

### Special geometry

Subtle chamfers/angles may be used selectively for:

- primary CTAs
- highlighted states
- race-state indicators
- active tabs
- branded moments

Avoid default SaaS-style `16px–24px` rounded cards across the product.

Pill-shaped controls should be exceptional rather than the base language.

---

## 9. Signature motif — Sepang circuit

The Sepang circuit is the most important recurring visual motif in the product.

Use it across:

- landing hero
- Sepang Explorer
- selected transitions
- progress/completion moments
- subtle background linework
- prediction summary/branded moments where appropriate

It may appear as:

- full 3D track
- flat circuit outline
- cropped track segment
- faint technical linework
- animated path

Do not use the circuit as meaningless wallpaper on every screen.

---

## 10. Approved motorsport visual language

Approved motifs include:

- starting-grid slots
- timing/classification rails
- track linework
- sector/corner markers
- race positions
- large race numbers
- countdown lights
- lap/step numbering
- pit-lane-style micro labels
- thin horizontal technical dividers
- restrained directional chevrons

Use checkered patterns extremely sparingly.

The interface should feel like motorsport without becoming a collection of racing clichés.

---

## 11. Three.js usage is predetermined

Three.js is part of the SEPANG 56 experience layer, but it does not own the application.

Implementation agents must follow `docs/threejs-experience.md` and may not invent additional 3D scenes without explicit product approval.

### Approved Three.js areas

#### Landing

- starting-light intro
- controlled race-car motion/presence
- Sepang circuit reveal
- cinematic camera movement

#### Learn — selected concepts only

- qualifying / starting grid
- pit stop
- Soft / Medium / Hard tyres
- simple overtaking / DRS demonstration

#### Understand Sepang

This is the primary Three.js experience.

- interactive stylized 3D Sepang circuit
- approved hotspots
- selected track-section highlighting
- controlled camera transitions
- desktop scene + side panel
- mobile scene + stacked/bottom-sheet context

#### Predictions

Lightweight 3D may support:

- driver/car presentation
- lock-in starting-light ceremony

### Three.js must not be used for

- authentication
- ordinary forms
- league creation/joining
- leaderboard itself
- profile/settings
- ordinary navigation
- basic content that is clearer in HTML/CSS

Critical product functionality must remain usable if WebGL is unavailable.

---

## 12. Motion language

Motion should feel **fast, deliberate, mechanical, and directional**.

Prefer:

- fast horizontal transitions
- decisive snap/slide entrances
- track-path drawing
- number roll/position movement where useful
- starting-light sequencing
- quick driver-card selection feedback
- timing-bar movement
- controlled Three.js camera moves only in approved scenes

Avoid:

- floaty SaaS fades
- springy/bouncy motion by default
- long decorative transitions
- animations that delay interaction

Typical conventional UI motion should generally fall around **150–350ms**.

Cinematic Three.js moments may be longer when intentionally staged.

Always respect `prefers-reduced-motion`.

---

## 13. Core component language

### Buttons

- strong contrast
- rectangular or subtly chamfered
- concise labels
- decisive visual state
- Race Red reserved primarily for the main action

Example labels:

- `GET RACE READY`
- `SELECT`
- `NEXT`
- `LOCK PICKS`
- `JOIN LEAGUE`

### Panels

- dark surfaces
- subtle border separation
- small-radius geometry
- no default glassmorphism

### Driver cards

Prioritize:

- driver surname
- race number
- team name
- restrained team-color identity rail
- strong selected state
- fast readable comparison

Driver selection should feel like making a race pick, not filling out a form.

### Learning screens

- one concept per primary view
- large lesson/step number
- short copy
- visual explanation first where possible
- one obvious continuation action
- no dense article layout

### Prediction screens

- one prediction task per screen
- clear progress indicator
- strong selection feedback
- large driver identity where applicable
- conventional readable summary before lock-in

### Leaderboard

The leaderboard should feel like a race classification/timing display while remaining an original SEPANG 56 component.

Prioritize:

- position
- username
- score
- position movement/state
- gap-like secondary information where useful

Do not style it like a generic admin spreadsheet.

---

## 14. Sepang Explorer composition

The 3D circuit is the visual hero.

### Desktop

Preferred composition:

```text
+--------------------------------------------------+
| SEPANG INTERNATIONAL CIRCUIT                     |
+-------------------------------+------------------+
|                               | TURN 01          |
|                               |                  |
|         3D CIRCUIT            | Heavy braking...|
|                               |                  |
|                               | WHY IT MATTERS   |
+-------------------------------+------------------+
```

The circuit may dominate the viewport while contextual information sits beside it.

### Mobile

Preferred composition:

```text
+------------------------+
|                        |
|      3D SEPANG         |
|       CIRCUIT          |
|                        |
+------------------------+
| TURN 01                |
| Heavy braking...       |
|                        |
| [ NEXT HOTSPOT ]       |
+------------------------+
```

A bottom sheet is also acceptable when it improves track visibility and touch interaction.

Mobile camera movement should be shorter and less dramatic than desktop.

---

## 15. Imagery

Use imagery deliberately rather than as generic card decoration.

Favor:

- wide motorsport photography
- cinematic cropping
- track/garage/race-weekend context
- restrained dark overlays when text sits above photography
- visual storytelling tied to Sepang or F1 concepts

Avoid generic stock-photo card grids.

Only use driver, team, championship, or circuit assets when their usage rights are appropriate.

---

## 16. Malaysian identity

Malaysia should provide identity without turning the interface into flag decoration.

Preferred expressions include:

- `SEPANG / MALAYSIA`
- Sepang-specific imagery
- circuit identity
- tropical/race-weekend environmental context
- occasional Malaysian flag where contextually meaningful
- subtle local color references only when useful

The motorsport product comes first; Malaysian identity makes it specific and memorable.

---

## 17. Accessibility

The technical visual style must not reduce usability.

Requirements:

- strong text/background contrast
- no status communicated by color alone
- keyboard access for conventional controls
- large mobile touch targets
- readable body text
- avoid tiny decorative telemetry becoming required information
- `prefers-reduced-motion` support
- critical content/actions remain accessible without WebGL
- 3D scenes need ordinary UI controls/alternatives

---

## 18. Performance

SEPANG 56 should **feel fast, not merely look fast**.

Three.js scenes must be progressively enhanced and performance-conscious.

Use:

- lazy loading
- compressed GLB/GLTF assets
- lightweight geometry
- strict texture budgets
- reduced mobile scene complexity where needed
- canvas suspension/unmounting when offscreen
- static/2D fallback

Avoid:

- oversized car models
- pointless particle systems
- always-running offscreen WebGL
- decorative shaders that materially hurt mobile performance

---

## 19. Brand/legal boundary

SEPANG 56 is F1-inspired, not an official Formula 1 product.

Do not copy:

- official F1 logo
- official F1 Tickets header/navigation branding
- proprietary official F1 typefaces
- protected broadcast graphics one-to-one
- team logos/assets unless usage rights are confirmed

Take inspiration from the **discipline and visual language of modern motorsport**, then create an original SEPANG 56 identity.

---

## 20. Explicit anti-patterns

Do not produce:

- generic SaaS dashboard styling
- endless large-radius cards
- gradient blobs
- glassmorphism everywhere
- neon cyberpunk aesthetics
- cartoon racing aesthetics
- random racing stripes
- excessive checkered flags
- excessive red
- tiny unreadable technical text
- mobile layouts that are merely shrunken desktop screens
- pointless 3D objects
- heavy animation on ordinary controls
- imitation F1 logos or proprietary visual assets

---

## 21. Final visual tests

Before approving any screen, ask:

> If the SEPANG 56 logo disappeared, would this still unmistakably feel like a premium modern motorsport/race-weekend experience?

If no, the screen is too generic.

Then ask:

> Is the screen still understandable to someone who knows nothing about Formula 1?

If no, the screen is too technical.

Both tests must pass.
