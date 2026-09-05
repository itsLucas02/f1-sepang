# SEPANG 56 — User Flow & App Structure

## Product flow principle

SEPANG 56 guides users through:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

This is a guided path, not a hard lock. Beginners should be encouraged to follow the sequence, but Learn and Sepang milestones do not block navigation.

---

## Product-flow status

The major MVP product flows are finalized:

- Learn → `docs/learn-flow-standard.md`
- Understand Sepang → `docs/sepang-flow-standard.md`
- Predictions → `docs/prediction-flow-standard.md`
- Scoring → `docs/scoring-standard.md`
- Leagues & Leaderboards → `docs/league-leaderboard-standard.md`
- Auth & Persistence → `docs/auth-persistence-standard.md`
- Implementation build order → `docs/implementation-blueprint.md`

Dedicated finalized standards override older/broader descriptions if a conflict remains elsewhere in the repo.

Implementation may now begin. Do not invent or reopen settled product rules during coding.

---

## Full application flowchart

```text
LANDING
   ↓
GET RACE READY
   ↓
F1 FAMILIARITY CHECK
   ├── BEGINNER → Lessons 01–06
   ├── BASICS   → Lessons 03–06 recommended
   └── FAN      → Sepang recommended
   ↓
RACE READY / CONTINUE
   ↓
MEET SEPANG
   ↓
GUIDED OR FREE CIRCUIT EXPLORER
   ↓
MAKE YOUR PICKS
   ↓
8 PREDICTION QUESTIONS
   ↓
PREDICTION SUMMARY
   ↓
SAVE / SUBMIT
   ↓
AUTH IF NEEDED
   ↓
SUBMITTED / EDITABLE UNTIL DEADLINE
   ↓
RACE DEADLINE
   ↓
LOCKED
   ↓
RACE RESULTS ENTERED
   ↓
SCORE /25
   ↓
GLOBAL LEADERBOARD
```

Auth happens late, after the user has already received value and created predictions.

---

## Learn flow — finalized

Source of truth: `docs/learn-flow-standard.md`.

Prompt:

**How familiar are you with F1?**

Options:

1. **I'm completely new**
2. **I know some basics**
3. **I already follow F1**

This is deterministic self-selection, not AI and not a scored quiz.

Recommended paths:

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

`Race Ready` is a milestone, not a permission gate.

---

## Understand Sepang flow — finalized

Source of truth: `docs/sepang-flow-standard.md`.

First visit:

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

Returning users open the explorer directly.

Approved MVP hotspots:

1. Main Straight
2. T1
3. T4
4. T9
5. T15

Recommended first-time order:

```text
MAIN STRAIGHT → T1 → T4 → T9 → T15
```

Interaction loop:

```text
SELECT HOTSPOT
  ↓
Update application state
  ↓
Three.js focuses/highlights selected section
  ↓
WHAT HAPPENS HERE?
  ↓
WHY IT MATTERS
  ↓
Mark hotspot visited
  ↓
Explore another OR Make Your Picks
```

Three.js is presentation only and does not own business/navigation state.

Visiting all five may produce **You Know Sepang**, but Predictions remain reachable earlier.

---

## Prediction flow — finalized

Source of truth: `docs/prediction-flow-standard.md`.

Exactly one question per screen.

Final eight questions:

1. Race Winner
2. Second Place
3. Third Place
4. Will the driver starting P1 win the race? — Yes / No
5. Fastest Lap
6. Rain during the race? — Yes / No
7. Safety Car during the race? — Yes / No
8. First Retirement

`Pole Position` is not part of the finalized question set.

Flow:

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

Rules:

- anonymous users may complete the full draft
- users may go backward and edit answers
- podium picks cannot duplicate drivers
- auth handoff must preserve completed picks
- one common deadline before the race
- submitted picks remain editable before the deadline
- picks become read-only automatically at/after the deadline
- no irreversible manual `LOCK PICKS` action

Lifecycle:

```text
DRAFT → SUBMITTED / EDITABLE → LOCKED
```

---

## Scoring — finalized

Source of truth: `docs/scoring-standard.md`.

```text
Race Winner             5
Second Place            4
Third Place             3
P1 starter wins?        2
Fastest Lap             3
Rain?                    2
Safety Car?              2
First Retirement        4
                       ───
MAXIMUM                 25
```

Correct answer = full points. Wrong answer = 0.

No partial credit.

After the race, enter one authoritative result object manually and score every submission deterministically.

Ties remain ties and use competition ranking:

```text
1, 2, 2, 4
```

---

## Global leaderboard flow — finalized

Source of truth: `docs/league-leaderboard-standard.md`.

```text
SUBMITTED PICKS
  ↓
RACE RESULTS ENTERED ONCE
  ↓
SCORE /25
  ↓
GLOBAL LEADERBOARD
```

The global leaderboard uses each user's one authoritative prediction score. There are no private leagues, memberships, join codes, invite links, or league routes.

---

## Auth & persistence — finalized

Source of truth: `docs/auth-persistence-standard.md`.

No auth required for:

- Landing
- Learn
- Sepang
- eight Prediction questions
- Prediction Summary

Auth required for:

- Save / Submit Picks

MVP provider:

```text
Supabase Auth + Google OAuth only
```

Anonymous browser state may hold:

```text
knowledgeLevel
completedLessonIds
visitedHotspots
predictionDraft
```

Minimal persisted model:

```text
profiles
prediction_submissions
race_results
```

Use normal small Supabase RLS policies. Prediction deadline enforcement must exist on the write path, not only in disabled client UI.

---

## Primary routes — finalized MVP direction

```text
/
/learn
/sepang
/predict
/predict/summary
/leaderboard
/auth/callback
```

Do not add dashboard, admin, profile, settings, league-settings, or other routes unless implementation demonstrates a real need.

---

## Returning users

Do not force onboarding again.

Returning users may go directly to Learn, Sepang, Predict, or Leaderboard.

The app can surface existing progress/status inside those flows without requiring a dedicated dashboard.

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
predictionStatus
submittedAt
updatedAt
deadlineAt
```

### Competition

```ts
score
ranking
```

---

## Implementation principle

Read `docs/implementation-blueprint.md` for build order.

Do not redesign finalized product behavior while coding. If a product decision genuinely needs to change, update the relevant dedicated standard first.
