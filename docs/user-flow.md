# SEPANG 56 — User Flow & App Structure

## Product flow principle

SEPANG 56 guides users through:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

This is a guided path, not a hard lock. Users may skip ahead, but beginners should be gently encouraged to follow the sequence.

---

## Product-flow status

The following flows are now finalized:

- Learn routing and progression → `docs/learn-flow-standard.md`
- Understand Sepang explorer flow → `docs/sepang-flow-standard.md`

The following still require product finalization before implementation rules are considered locked:

- exact Prediction question set and scoring
- prediction edit/lock rules
- league scoring and ranking rules
- final auth behavior and persistence details

Do not infer missing rules.

---

## Full application flowchart

```text
                         ┌──────────────┐
                         │   LANDING    │
                         └──────┬───────┘
                                │
                         Get Race Ready
                                │
                                ▼
                    ┌──────────────────────┐
                    │ F1 FAMILIARITY CHECK │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼──────────────┐
                 │             │              │
             BEGINNER        BASICS           FAN
                 │             │              │
                 ▼             ▼              │
          LESSONS 01–06    LESSONS 03–06      │
                 │             │              │
                 └──────┬──────┘              │
                        │                     │
                        └──────────┬──────────┘
                                   ▼
                        ┌────────────────────┐
                        │  UNDERSTAND SEPANG │
                        └─────────┬──────────┘
                                  │
                         Guided / Free Explore
                                  │
                                  ▼
                        ┌────────────────────┐
                        │    PREDICTIONS     │
                        └─────────┬──────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ PREDICTION SUMMARY │
                        └─────────┬──────────┘
                                  │
                        Want to save picks?
                                  │
                                  ▼
                            ┌──────────┐
                            │   AUTH   │
                            └────┬─────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   LOCK PICKS    │
                        └───────┬─────────┘
                                │
                     ┌──────────┼──────────┐
                     │          │          │
                     ▼          ▼          ▼
                  CREATE      JOIN       GLOBAL
                  LEAGUE      LEAGUE     BOARD
                     │          │          │
                     └──────────┴────┬─────┘
                                     ▼
                              ┌──────────────┐
                              │ LEADERBOARD  │
                              └──────┬───────┘
                                     │
                                     ▼
                              RETURN / RESULTS
```

---

## Learn flow — finalized

Source of truth: `docs/learn-flow-standard.md`.

### Familiarity check

Prompt:

**How familiar are you with F1?**

Options:

1. **I'm completely new**
2. **I know some basics**
3. **I already follow F1**

This is deterministic self-selection. It is not an AI system and not a scored quiz.

Suggested state:

```ts
knowledgeLevel = "beginner" | "basics" | "fan"
```

### Recommended paths

```text
BEGINNER
  ↓
01 Race Weekend
02 How the Race Works
03 Overtaking
04 Tyres & Pit Stops
05 Flags & Safety Car
06 How to Watch
  ↓
RACE READY
```

```text
BASICS
  ↓
03 Overtaking
04 Tyres & Pit Stops
05 Flags & Safety Car
06 How to Watch
  ↓
RACE READY
```

Lessons 01–02 remain accessible.

```text
FAN
  ↓
MEET SEPANG
```

All Learn content remains accessible.

### Soft progression

`Race Ready` is a milestone, not a permission gate.

Users may navigate to Sepang or Predict without completing Learn.

No XP, badges, streaks, achievements, mandatory quizzes, or AI tutoring are part of MVP.

---

## Understand Sepang flow — finalized

Source of truth: `docs/sepang-flow-standard.md`.

### First visit

```text
MEET SEPANG
  ↓
Short circuit introduction
  ↓
START GUIDED TOUR
  ↓
CIRCUIT EXPLORER
```

The user may switch immediately to **Explore Freely**.

### Returning visit

```text
SEPANG
  ↓
CIRCUIT EXPLORER
  ↓
FREE EXPLORE
```

Do not force the introduction again.

### Approved hotspots

The MVP contains exactly:

1. Main Straight
2. T1
3. T4
4. T9
5. T15

Recommended first-time tour order:

```text
MAIN STRAIGHT → T1 → T4 → T9 → T15
```

The user may select any hotspot at any time.

### Interaction loop

```text
SELECT HOTSPOT
  ↓
Update React/application state
  ↓
Three.js focuses and highlights the selected track section
  ↓
WHAT HAPPENS HERE?
  ↓
WHY IT MATTERS
  ↓
Mark hotspot visited
  ↓
Explore another OR Make Your Picks
```

Three.js is a presentation layer. It must not own business/navigation state.

### Sepang Ready

Visiting all five recommended hotspots may produce:

```text
YOU KNOW SEPANG

You know the key places to watch.

[ MAKE YOUR PICKS → ]
```

This is not a hard gate. Predictions remain reachable earlier.

Final educational copy for the five hotspots must be fact-checked before it is locked. Stitch placeholder copy is not factual authority.

---

## First-time user flow

```text
LANDING
  ↓
GET RACE READY
  ↓
F1 FAMILIARITY CHECK
  ↓
RECOMMENDED LEARN PATH
  ↓
RACE READY / CONTINUE
  ↓
MEET SEPANG
  ↓
GUIDED OR FREE CIRCUIT EXPLORER
  ↓
MAKE PREDICTIONS
  ↓
REVIEW PICKS
  ↓
AUTH / CREATE ACCOUNT
  ↓
LOCK PICKS
  ↓
CREATE / JOIN LEAGUE
  ↓
LEADERBOARD
```

Auth should happen late, after the user has already received value and created predictions.

Users may browse Learn and Sepang and create temporary predictions before signing in.

---

## Prediction flow — draft, not yet finalized

Use one question per screen.

The current working concept is eight prediction steps followed by a summary, but the exact question set, scoring, and lock/edit rules must be finalized separately before implementation.

Do not treat old placeholder questions in design exports as source of truth.

High-level flow:

```text
PREDICTION 01
  ↓
PREDICTION 02
  ↓
...
  ↓
PREDICTION 08
  ↓
PREDICTION SUMMARY
```

Every F1-specific term must have a short beginner-friendly explanation where needed.

---

## League mechanism — concept approved, mechanics not yet finalized

A **league** is a private prediction leaderboard for friends or community members.

It is not an F1 racing league and does not simulate races.

Core concept:

```text
PICKS SAVED / LOCKED
  ↓
CREATE LEAGUE or JOIN LEAGUE
  ↓
SHARE CODE / LINK
  ↓
FRIENDS JOIN
  ↓
PREDICTIONS ARE SCORED
  ↓
LEAGUE LEADERBOARD
```

MVP should not contain chat, feed, messaging, team management, or social-network features.

Exact scoring and ranking rules still require finalization.

---

## Returning-user direction

Returning users should not be forced through onboarding again.

The app may surface progress such as:

- Learn status
- Sepang hotspot progress
- Prediction status
- league ranking

A dedicated returning-user dashboard is not yet a mandatory MVP screen unless explicitly finalized.

---

## Primary navigation

Working top-level destinations:

- Learn
- Sepang
- Predict
- Leaderboard

Profile/account access may exist where needed but must not displace the primary product loop.

Suggested routes:

```text
/
/learn
/sepang
/predict
/leaderboard
/league/[code]
```

Additional routes should be added only when implementation needs them.

---

## State model

### Learn

```ts
knowledgeLevel
recommendedLessonIds
completedLessonIds
raceReady
```

### Sepang

```ts
hasVisitedSepang
tourMode
selectedHotspot
visitedHotspots
sepangReady
```

### Later product state

```text
predictions
predictionStatus
score
leagues
```

Prediction/league persistence details are intentionally left open until those systems are finalized.

---

## Implementation principle

When broad documentation and a finalized flow standard differ, use the dedicated finalized standard:

- `docs/learn-flow-standard.md`
- `docs/sepang-flow-standard.md`

Do not redesign finalized product behavior during implementation. Update the product documentation first if the product owner changes the flow.
