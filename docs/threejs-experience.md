# SEPANG 56 — Approved Three.js Experience Map

## Purpose

Three.js exists to make the simple MVP feel like a premium, interactive motorsport experience.

It must enhance the four product pillars without creating additional product scope:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

Three.js is an experience/rendering layer. It must not own authentication, prediction state, league logic, scoring, or other business logic.

---

# Approved 3D scenes

These are the intended Three.js use cases for the MVP. Coding agents should not invent additional 3D scenes unless explicitly instructed.

## Scene 1 — Opening / landing sequence

### Goal

Immediately establish motorsport energy and make the product memorable before the user starts learning.

### Desktop experience

1. Initial near-black scene.
2. Five red starting lights illuminate sequentially.
3. On lights-out, a stylised Formula-style open-wheel race car passes rapidly through frame or the camera accelerates past it.
4. Motion reveals/builds the Sepang circuit outline in 3D.
5. Camera settles into a composed hero view with the circuit as a signature visual.
6. Hero copy and `GET RACE READY` CTA become the primary focus.

### Mobile experience

Preserve the same story but shorten and simplify it:

1. Starting lights.
2. Fast motion cue / car silhouette or lightweight 3D car pass.
3. Sepang circuit resolves behind or around the hero copy.
4. Avoid forcing the user to wait for a long cinematic sequence before interacting.

### Rules

- Sequence should feel fast, not like a game loading screen.
- User can interact promptly.
- Reduced-motion mode skips camera rush/pass and shows a composed static/low-motion circuit scene.
- If WebGL/3D cannot load, fall back to a strong 2D circuit hero without blocking the CTA.

---

## Scene 2 — Interactive Sepang circuit explorer

### Goal

This is the main 3D centerpiece of the product and the primary experience for **Understand Sepang**.

### Visual model

Use a stylised circuit representation rather than attempting a photorealistic digital twin.

Preferred characteristics:

- recognizable Sepang track geometry
- elevated or slightly extruded asphalt
- red/white kerb cues where useful
- subtle ground plane / terrain abstraction
- glowing or high-contrast racing line accents used sparingly
- labelled hotspots
- premium dark presentation

### Interaction

The user can select predetermined hotspots such as:

- Turn 1 / opening complex
- main straight
- another important corner/sector chosen during content finalisation
- weather / heat context represented as a circuit-wide concept rather than fake live weather

When a hotspot is selected:

1. Camera smoothly reframes toward the relevant circuit area.
2. Selected track segment receives clear focus/highlight.
3. A readable information panel appears.
4. Explanation remains beginner-friendly: what it is, why it matters, what to watch for.

### Desktop

- Circuit may occupy the majority of the viewport.
- Information panel can live beside the scene.
- Mouse hover may preview hotspots, but click/tap is authoritative.
- Camera movement can be more spatial and cinematic.

### Mobile

- Circuit occupies the upper or central portion of the viewport.
- Hotspots must be large enough to tap.
- Detail content should appear in a bottom sheet / stacked panel rather than competing horizontally with the 3D scene.
- Camera transitions should be shorter and less disorienting.
- Pinch/drag exploration is optional; required information must not depend on precision gestures.

### Rules

- Do not build a driving simulator.
- Do not build real-time cars or GPS telemetry.
- Any decorative cars moving on circuit are ambient only and must be lightweight.
- The user must always have a clear way to reset/recenter the circuit view.

---

## Scene 3 — Visual F1 learning moments

### Goal

Replace dull paragraphs with short visual demonstrations where 3D meaningfully improves comprehension.

Three.js is not required for every lesson. Use it only for these approved concepts where spatial/physical demonstration helps.

### 3A — Starting grid / qualifying

Show a simplified grid with cars occupying P1, P2, P3, etc.

Purpose:

> Qualifying determines the order cars start the race.

No simulation is required.

### 3B — Pit stop

Show a stylised car entering/stopping in a pit box and a quick tyre-change visual.

Purpose:

> A pit stop costs time now so the driver can continue on different/fresher tyres.

Do not attempt mechanic-level simulation or photoreal pit crews for MVP.

### 3C — Tyres

Show interactive/rotatable tyre objects or clearly dimensional tyre representations for:

- Soft
- Medium
- Hard

Educational message stays intentionally simple:

- Soft: faster, wears faster
- Medium: balanced
- Hard: slower, lasts longer

### 3D — Overtaking / DRS concept

If included in the final learning curriculum, show two simplified cars and an opening rear-wing cue / speed difference visual.

Purpose is conceptual understanding only. Do not model aerodynamics or physics.

### Desktop vs mobile

Desktop can place the 3D explanation alongside copy. Mobile should stack visual first and explanation immediately below, keeping the lesson understandable without drag/rotate gestures.

---

## Scene 4 — Prediction selection presentation

### Goal

Make a basic prediction form feel like selecting a grid rather than filling out a questionnaire.

### Three.js role

3D is supporting, not required for every driver card.

Approved treatment:

- Selecting a driver may reveal a lightweight stylised car/car silhouette presentation associated with the choice.
- Transition may shift camera/light subtly as the selected driver becomes the active pick.
- Avoid building one heavy unique car model per driver/team unless asset/performance budget clearly supports it.

The core selection UI remains accessible HTML/UI so prediction state is robust and easy to use.

### Lock-in ceremony

When all predictions are reviewed and the user chooses to lock picks:

1. Show five starting lights.
2. Lights-out / quick race-start motion cue.
3. Transition to `PICKS LOCKED` state.

This may use Three.js or a lighter motion technique depending on implementation, but the visual story is fixed.

---

# Areas that should NOT use Three.js in MVP

Do not add 3D merely because the library is available.

The following should remain primarily conventional UI:

- authentication
- profile/settings
- league creation form
- league join form
- prediction summary/editing
- leaderboard data itself
- navigation
- error states
- content-heavy explanatory panels

The leaderboard should look like an F1 timing tower using typography, layout and motion—not a 3D leaderboard.

---

# Transition language

Use Three.js only where a spatial transition makes sense. Use CSS/Framer Motion/GSAP for ordinary UI movement.

Approved major experiential transition:

## Learn → Sepang

On completion of the recommended learning sequence:

1. Race School completion state appears.
2. Current lesson interface recedes/dissolves quickly.
3. Sepang circuit emerges as the dominant visual.
4. Camera settles into the circuit explorer.
5. `MEET SEPANG` / equivalent introduction appears.

Mobile version should be shorter and may use a hybrid 2D/3D transition.

---

# Responsive design contract

Desktop and mobile are not the same canvas at different widths.

## Desktop

Use available space for cinematic composition:

- larger circuit presence
- split layouts
- side information panels
- broader camera movement
- larger negative space around hero typography

## Mobile

Prioritize clarity and touch:

- shorter camera movement
- fewer simultaneous objects
- stacked content
- bottom sheets for circuit information
- larger tap targets
- keep CTA/content visible even while 3D is loading

Never force desktop interaction patterns such as precise hover, tiny track hotspots, or side-by-side dense panels onto mobile.

---

# Performance contract

- Lazy-load Three.js and heavy assets.
- Use GLB/glTF where 3D assets are needed.
- Compress geometry and textures.
- Keep polygon counts appropriate for mobile browsers.
- Avoid excessive particles, reflections, post-processing, or large environment maps unless performance is proven.
- Pause or reduce rendering when scenes are not visible.
- Respect `prefers-reduced-motion`.
- Provide non-WebGL/static fallbacks for critical product paths.
- Core app functionality must never depend on successful 3D rendering.

---

# Architectural contract

Recommended separation:

```text
PRODUCT / BUSINESS LAYER
Learn state
Sepang content state
Predictions
Auth
Leagues
Leaderboard
        |
        v
EXPERIENCE ADAPTERS
Scene props / selected hotspot / selected driver
        |
        v
THREE.JS RENDERING LAYER
Hero scene
Circuit explorer
Learning visuals
Prediction presentation
```

Three.js components receive state; they do not become the source of truth for state.

---

# Final implementation rule

Before adding any new Three.js usage, ask:

> Is this exact 3D interaction already approved in this document?

If no, do not add it without a product decision.
