# SEPANG 56 — MVP Product Blueprint

## Product promise

**SEPANG 56 — Learn F1. Discover Sepang. Make your picks. Beat your friends.**

Target user:

> “F1 is coming to Malaysia. I barely know anything about F1, but I want to understand enough to enjoy it and join in with my friends.”

The goal is not to turn beginners into experts. The goal is to move them from:

> “What even is F1?”

into:

> “I understand what I’m watching, I know the key places at Sepang, and I have picks I can compare with my friends.”

---

## MVP pillars

### 1. Learn — finalized

Source of truth: `docs/learn-flow-standard.md`.

Users self-select:

- **I'm completely new**
- **I know some basics**
- **I already follow F1**

Approved lessons:

1. Race Weekend
2. How the Race Works
3. Overtaking
4. Tyres & Pit Stops
5. Flags & Safety Car
6. How to Watch

Beginner users are recommended all six lessons. Basics users are recommended lessons 3–6. Existing fans may continue directly to Sepang.

`Race Ready` is encouragement, not a hard gate.

### 2. Understand Sepang — finalized

Source of truth: `docs/sepang-flow-standard.md`.

Exactly five MVP hotspots:

1. Main Straight
2. T1
3. T4
4. T9
5. T15

First-time recommended order:

**Main Straight → T1 → T4 → T9 → T15**

Each hotspot answers:

- **What happens here?**
- **Why it matters when watching the race**

Three.js focuses/highlights the selected circuit section while normal application UI owns state and educational content.

`You Know Sepang` is a milestone, not a hard gate.

### 3. Make predictions — finalized

Source of truth: `docs/prediction-flow-standard.md`.

Exactly eight questions, one per screen:

1. Race Winner
2. Second Place
3. Third Place
4. Will the driver starting P1 win the race? — Yes / No
5. Fastest Lap
6. Rain during the race? — Yes / No
7. Safety Car during the race? — Yes / No
8. First Retirement

Core behavior:

- anonymous draft allowed
- users may go back and edit
- podium drivers cannot duplicate
- summary before persistence
- auth only when saving/submitting requires it
- draft survives auth handoff
- one common pre-race deadline
- submitted picks remain editable before the deadline
- picks become read-only automatically at/after the deadline
- no manual irreversible lock button

Lifecycle:

**Draft → Submitted / Editable → Locked**

### 4. Score predictions — finalized

Source of truth: `docs/scoring-standard.md`.

Maximum score: **25 points**.

```text
Winner             5
P2                 4
P3                 3
P1 starter wins?   2
Fastest Lap        3
Rain?              2
Safety Car?        2
First Retirement   4
```

Correct = full points. Wrong = 0. No partial credit.

Race answers are entered once after the race and submissions are scored deterministically.

Ties remain ties.

### 5. Compete with friends — finalized

Source of truth: `docs/league-leaderboard-standard.md`.

Users can:

- create a private league by entering a name
- receive a unique join code/share link
- join a league by code/link
- belong to multiple leagues
- compare the same prediction score across private leagues
- view a global leaderboard

Private/friends competition remains the primary social use case.

No chat, feed, reactions, roles, seasons, custom scoring, moderation system, or social-network features belong in MVP.

### 6. Auth & persistence — finalized

Source of truth: `docs/auth-persistence-standard.md`.

Users can browse Learn, Sepang, make all eight predictions, and reach Prediction Summary without signing in.

Auth is required only for:

- saving/submitting picks
- creating a league
- joining a league

MVP auth:

**Supabase Auth + Google OAuth only.**

Minimal persisted tables:

```text
profiles
prediction_submissions
leagues
league_members
race_results
```

---

## Primary user scenario

1. User opens SEPANG 56.
2. Landing offers **Get Race Ready**.
3. User selects their F1 familiarity level.
4. The app recommends the appropriate Learn path.
5. User completes as much Learn content as they want.
6. User enters Sepang and explores the five key locations.
7. User makes eight predictions one question at a time.
8. User reviews and edits picks.
9. User chooses to save/submit.
10. If needed, Google authentication occurs and returns them to their picks.
11. Submitted picks remain editable until the common race deadline.
12. Picks become read-only at the deadline.
13. User creates or joins private leagues.
14. After the race, the eight official result answers are entered once.
15. Predictions are scored out of 25.
16. Global and private league leaderboards show the final rankings.

---

## Core product loop

**Learn → Understand Sepang → Predict → Compete**

Nothing should interrupt or dilute this loop in MVP.

---

## Implementation status

The major MVP product decisions are now finalized.

Implementation should follow:

- `docs/implementation-blueprint.md`
- `docs/component-architecture.md`
- `DESIGN.md`
- the dedicated finalized flow/behavior standards

Apply KISS and YAGNI aggressively. Do not build future-platform infrastructure that the current MVP does not require.

---

## MVP acceptance test

Give SEPANG 56 to someone who has never watched F1. They should be able to:

- understand the core race concepts needed to follow the event
- identify the key places to watch at Sepang
- make eight understandable predictions
- save/edit those predictions before the deadline
- compare a scored result with friends in a private league

If those outcomes work cleanly on desktop and mobile, the MVP is doing its job.