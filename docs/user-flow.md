# SEPANG 56 — User Flow & App Structure

## Product flow principle

SEPANG 56 guides users through:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

This is a guided path, not a hard lock. Beginners should be gently encouraged to follow the sequence, but Learn and Sepang milestones do not block navigation.

---

## Product-flow status

The following product flows are finalized:

- Learn routing and progression → `docs/learn-flow-standard.md`
- Understand Sepang explorer flow → `docs/sepang-flow-standard.md`
- Prediction flow, question set, editing, and deadline model → `docs/prediction-flow-standard.md`

The following still require product finalization:

- scoring values and edge-case definitions
- league ranking/tie rules
- final auth/provider and persistence details

Dedicated finalized standards override older/broader descriptions if any conflict remains elsewhere in the repo.

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
                           8 questions
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ PREDICTION SUMMARY │
                        └─────────┬──────────┘
                                  │
                              Save / Submit
                                  │
                                  ▼
                            ┌──────────┐
                            │ AUTH IF  │
                            │ REQUIRED │
                            └────┬─────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ SUBMITTED / EDITABLE    │
                    │ until race deadline     │
                    └───────────┬─────────────┘
                                │
                         Race deadline
                                │
                                ▼
                         ┌──────────────┐
                         │ PICKS LOCKED │
                         └──────┬───────┘
                                │
                     ┌──────────┼──────────┐
                     │                     │
                     ▼                     ▼
                  CREATE                  JOIN
                  LEAGUE                  LEAGUE
                     │                     │
                     └──────────┬──────────┘
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

This is deterministic self-selection. It is not AI and not a scored quiz.

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

`Race Ready` is a milestone, not a permission gate.

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

### Approved hotspots

Exactly five MVP hotspots:

1. Main Straight
2. T1
3. T4
4. T9
5. T15

Recommended first-time order:

```text
MAIN STRAIGHT → T1 → T4 → T9 → T15
```

### Interaction loop

```text
SELECT HOTSPOT
  ↓
Update application state
  ↓
Three.js focuses/highlights selected track section
  ↓
WHAT HAPPENS HERE?
  ↓
WHY IT MATTERS
  ↓
Mark hotspot visited
  ↓
Explore another OR Make Your Picks
```

Three.js is presentation only and must not own business/navigation state.

Visiting all five may produce a **You Know Sepang** milestone, but Predictions remain reachable earlier.

---

## Prediction flow — finalized

Source of truth: `docs/prediction-flow-standard.md`.

Use exactly one question per screen.

### Final eight questions

1. Race Winner
2. Second Place
3. Third Place
4. Will the driver starting P1 win the race? — Yes / No
5. Fastest Lap
6. Rain during the race? — Yes / No
7. Safety Car during the race? — Yes / No
8. First Retirement

`Pole Position` is not part of the finalized question set.

### Flow

```text
MAKE YOUR PICKS
  ↓
01 Race Winner
  ↓
02 Second Place
  ↓
03 Third Place
  ↓
04 Will P1 starter win?
  ↓
05 Fastest Lap
  ↓
06 Rain?
  ↓
07 Safety Car?
  ↓
08 First Retirement
  ↓
PREDICTION SUMMARY
  ↓
Edit any pick OR Save / Submit
```

Users may move backward and change earlier answers.

The same driver cannot occupy more than one predicted podium position.

### Auth handoff

Anonymous users may complete the entire temporary draft and reach Prediction Summary.

```text
ANONYMOUS DRAFT
  ↓
SUMMARY
  ↓
SAVE / SUBMIT
  ↓
AUTH IF NEEDED
  ↓
RETURN WITH DRAFT INTACT
  ↓
PERSIST
```

Auth must not erase completed prediction work.

### Final deadline model

SEPANG 56 uses **one common deadline before the race**.

There are no split qualifying/race deadlines in MVP.

Prediction lifecycle:

```text
DRAFT
  ↓
SUBMITTED / EDITABLE
  ↓
RACE DEADLINE
  ↓
LOCKED
```

Before the deadline, submitted picks remain editable.

At or after the deadline, picks lock automatically and become read-only.

There is no irreversible manual `LOCK PICKS` button before the deadline.

Scoring values and edge-case result definitions are finalized separately.

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
AUTH IF NEEDED TO SAVE
  ↓
SUBMITTED / EDITABLE
  ↓
AUTO-LOCK AT RACE DEADLINE
  ↓
CREATE / JOIN LEAGUE
  ↓
LEADERBOARD
```

Auth happens late, after the user has already received value and created their picks.

---

## League mechanism — concept approved, mechanics not yet finalized

A **league** is a private prediction leaderboard for friends or community members.

It is not an F1 racing league and does not simulate races.

Core concept:

```text
PICKS SAVED
  ↓
CREATE LEAGUE or JOIN LEAGUE
  ↓
SHARE CODE / LINK
  ↓
FRIENDS JOIN
  ↓
PREDICTIONS LOCK AT DEADLINE
  ↓
RESULTS ARE SCORED
  ↓
LEAGUE LEADERBOARD
```

MVP should not contain chat, feed, messaging, team management, or social-network features.

Exact scoring, ranking, and tie-break rules still require finalization.

---

## Returning-user direction

Returning users should not be forced through onboarding again.

The app may surface:

- Learn status
- Sepang hotspot progress
- prediction status: Draft / Submitted / Locked
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

### Predictions

```ts
answers
currentQuestion
predictionStatus // draft | submitted | locked
submittedAt
updatedAt
deadlineAt
```

### Competition — still to finalize

```text
score
leagues
ranking
```

---

## Implementation principle

When broad documentation and a finalized flow standard differ, use the dedicated finalized standard:

- `docs/learn-flow-standard.md`
- `docs/sepang-flow-standard.md`
- `docs/prediction-flow-standard.md`

Do not redesign finalized product behavior during implementation. Update product documentation first if the product owner changes a flow.
