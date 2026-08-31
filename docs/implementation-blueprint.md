# SEPANG 56 — MVP Implementation Blueprint

## Status

**Implementation-ready.**

The major MVP product decisions are finalized. This document defines the build order and technical boundaries for implementation.

Do not reopen settled product decisions while coding. If a real implementation constraint requires a product change, update the relevant source-of-truth document first.

---

## 1. Product loop

Build around exactly:

```text
Learn → Understand Sepang → Predict → Compete
```

The app is beginner-first, mobile-first-class, visually premium, and intentionally narrow in feature scope.

---

## 2. Planned stack

Use the repository-approved stack:

- Next.js / React
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix primitives for interaction behavior
- Three.js
- React Three Fiber
- Drei
- Motion / Framer Motion for ordinary UI motion
- Supabase Auth + database
- static/local content for Learn and Sepang where practical

Do not add GSAP unless an approved interaction genuinely requires it.

Do not add another state-management library unless React/local feature state becomes demonstrably insufficient.

---

## 3. Source-of-truth documents

Before implementation, read:

1. `AGENTS.md`
2. `DESIGN.md`
3. `docs/ui-standardization.md`
4. `docs/component-architecture.md`
5. `docs/learn-flow-standard.md`
6. `docs/sepang-flow-standard.md`
7. `docs/prediction-flow-standard.md`
8. `docs/scoring-standard.md`
9. `docs/league-leaderboard-standard.md`
10. `docs/auth-persistence-standard.md`
11. responsive standards under `docs/mobile-*.md`
12. `docs/threejs-experience.md`

Approved Stitch screenshots/HTML are visual references only and remain subordinate to these documents.

---

## 4. Route structure

Use the smallest route set that covers the MVP:

```text
/
/learn
/sepang
/predict
/predict/summary
/leaderboard
/league/[code]
/auth/callback
```

Do not create dashboard, admin, settings, league-settings, profile, or other routes unless implementation later proves they are necessary.

---

## 5. Component layering

Follow `docs/component-architecture.md`:

```text
Radix / shadcn primitives
          ↓
SEPANG shared components
          ↓
Feature components
          ↓
Pages / flows
```

Examples:

- `RadioGroup` behavior → custom `FamiliarityCard`
- `RadioGroup` behavior → custom `DriverCard`
- Tabs/roving-focus behavior → custom `CircuitHotspotTabs`
- Sheet/Drawer behavior → custom mobile circuit information presentation when needed
- Dialog/Form behavior → league create/join UI

Do not use stock shadcn visual identity.

---

## 6. Suggested code organization

Keep structure obvious and feature-oriented.

```text
app/
  page.tsx
  learn/
  sepang/
  predict/
    page.tsx
    summary/
  leaderboard/
  league/[code]/
  auth/callback/

components/
  ui/                  # shadcn primitives
  shared/              # RaceHeader, RaceFooter, shared shell
  learn/
  sepang/
  prediction/
  competition/

content/
  lessons.ts
  sepang.ts
  drivers.ts

lib/
  supabase/
  scoring.ts
  predictions.ts
  leagues.ts
  constants.ts

types/
```

Do not create layers merely to satisfy an architecture pattern. Keep modules small and inspectable.

---

## 7. Client state

Anonymous/local state:

```text
knowledgeLevel
completedLessonIds
visitedHotspots
predictionDraft
```

Use simple React state plus local storage where persistence across reload/auth is needed.

Three.js state remains normal application state:

```text
selectedHotspot
visitedHotspots
tourMode
```

The 3D scene receives state through props/context and does not own product navigation or persistence.

---

## 8. Supabase persistence

Use the minimal model from `docs/auth-persistence-standard.md`:

```text
profiles
prediction_submissions
leagues
league_members
race_results
```

Important constraints:

- one prediction submission per user for this MVP event
- unique league membership per user/league pair
- prediction writes rejected at/after the configured deadline
- normal users cannot write race results
- use small explicit RLS policies

Do not add a CMS or generic prediction-question schema.

---

## 9. Build order

### Phase 0 — Project foundation

- initialize/confirm Next.js + TypeScript
- configure Tailwind
- install/configure shadcn/ui
- define exact design tokens/fonts from `DESIGN.md`
- create shared application shell
- establish lint/typecheck/test commands

### Phase 1 — Landing

- implement approved desktop/mobile Landing composition
- `RaceHeader`
- `RaceFooter`
- journey cards
- `GET RACE READY`
- responsive behavior

Do not start with Three.js polish. First establish the correct page composition and responsive shell.

### Phase 2 — Learn

- familiarity selection
- deterministic recommended path
- six lessons
- lesson progress
- `Race Ready` milestone
- local persistence
- approved lightweight visuals

### Phase 3 — Sepang Explorer

- static content structure first
- five hotspot selector
- `CircuitInfoPanel`
- guided/free state
- visited-hotspot progress
- 2D/static fallback
- then implement approved Three.js circuit scene and camera/highlight behavior

### Phase 4 — Predictions

- reusable `PredictionStep`
- `DriverCard`
- eight finalized questions
- podium duplicate prevention
- anonymous draft persistence
- summary/edit flow
- deadline-derived locked UI

### Phase 5 — Supabase + Auth

- Supabase project/config integration
- Google OAuth
- auth callback/return destination
- profiles
- prediction persistence
- preserve anonymous draft through auth
- enforce prediction deadline server-side

### Phase 6 — Competition

- deterministic scoring function + unit tests
- race-result storage
- global leaderboard
- create league
- join by code/link
- league leaderboard
- tied rankings

### Phase 7 — Presentation polish

- approved Three.js landing/prediction moments
- Motion transitions
- reduced-motion behavior
- loading/error states
- final responsive passes
- accessibility checks
- performance/lazy-loading checks

Do not let polish introduce new product features.

---

## 10. Testing priorities

At minimum, cover the business rules most likely to break competition:

- familiarity branching
- Race Ready recommendation completion
- hotspot visited state
- podium duplicate prevention
- prediction draft survives reload/auth handoff
- deadline prevents writes
- exact-match scoring totals to 25
- league membership uniqueness
- leaderboard tie ranking (`1, 2, 2, 4`)

Prefer unit tests for deterministic logic and focused integration/E2E tests for the major user flow.

---

## 11. Content boundary

Learn and Sepang educational copy may remain static in source files.

Before production/demo lock:

- verify current driver/team data
- verify Sepang hotspot factual copy
- verify race-specific deadline/start-grid data

Do not let Stitch placeholder content become factual production data.

---

## 12. Definition of MVP implementation complete

A new user can:

```text
Open Landing
  ↓
Select F1 familiarity
  ↓
Use Learn
  ↓
Explore Sepang
  ↓
Make all 8 predictions anonymously
  ↓
Review picks
  ↓
Sign in with Google when saving
  ↓
Keep/edit submitted picks before deadline
  ↓
See picks locked after deadline
  ↓
Create or join a private league
  ↓
See scored global/private leaderboards after results are entered
```

The experience must work on desktop and mobile and remain usable without successful 3D rendering.

---

## 13. KISS / YAGNI implementation rule

When deciding between a small direct solution and a generalized future-proof framework, choose the small direct solution unless current MVP requirements prove otherwise.

Examples:

- static lesson content over CMS
- one JSON answer object over generic question tables
- one race deadline over scheduling infrastructure
- one scoring function over a rules engine
- one league membership table over a social platform
- local storage over offline-sync architecture
- Google OAuth only over multi-provider auth

Build the MVP that exists, not the hypothetical platform it could become.