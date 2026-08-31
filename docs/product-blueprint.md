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

### 1. Learn — finalized flow

Source of truth: `docs/learn-flow-standard.md`.

Users first self-select their familiarity level:

- **I'm completely new**
- **I know some basics**
- **I already follow F1**

The app deterministically recommends the appropriate path. No AI or scored knowledge quiz is involved.

Approved lesson set:

1. Race Weekend
2. How the Race Works
3. Overtaking
4. Tyres & Pit Stops
5. Flags & Safety Car
6. How to Watch

Beginner users are recommended all six lessons. Users who know some basics are recommended lessons 3–6. Existing F1 fans may continue directly to Sepang.

Lessons are short, visual, and beginner-first. Completing the recommended path produces a **Race Ready** milestone, but Learn is not a hard gate.

### 2. Understand Sepang — finalized flow

Source of truth: `docs/sepang-flow-standard.md`.

The Sepang experience is a guided-but-free circuit explorer built around exactly five MVP hotspots:

1. Main Straight
2. T1
3. T4
4. T9
5. T15

First-time users receive a short introduction and a recommended guided order:

**Main Straight → T1 → T4 → T9 → T15**

Users may switch to free exploration or select any hotspot at any time.

Each hotspot teaches two things:

- **What happens here?**
- **Why it matters when watching the race**

Three.js focuses/highlights the selected circuit section while normal application UI presents the educational content. Three.js does not own application state.

Visiting all five hotspots may produce a **You Know Sepang** milestone, but Predictions remain accessible earlier.

Final hotspot educational copy must be fact-checked before being locked.

### 3. Make predictions — finalized core flow

Source of truth: `docs/prediction-flow-standard.md`.

The Prediction experience uses exactly eight questions, one per screen:

1. Race Winner
2. Second Place
3. Third Place
4. Will the driver starting P1 win the race? — Yes / No
5. Fastest Lap
6. Rain during the race? — Yes / No
7. Safety Car during the race? — Yes / No
8. First Retirement

`Pole Position` is not part of the finalized question set.

Core behavior:

- temporary anonymous draft allowed
- one question per screen
- users may go back and edit answers
- podium picks cannot duplicate drivers
- all eight picks are reviewed on Prediction Summary
- auth occurs only when persistence is needed
- auth handoff must preserve the completed draft
- submitted picks remain editable before the race deadline
- one common pre-race prediction deadline
- picks lock automatically at the deadline
- no irreversible user-operated lock button before the deadline

Prediction lifecycle:

**Draft → Submitted / Editable → Locked**

Scoring values and a few result-definition edge cases are finalized in the next product phase.

### 4. Compete with friends — mechanics still to finalize

The core concept is approved:

- create a private league
- join by code/link
- compare prediction scores with friends
- leaderboard ranking

A global leaderboard may also exist, but private/friends competition is the primary social use case.

No chat, feed, reactions, messaging, or complex social system belongs in MVP.

Exact scoring/ranking/tie mechanics still require product finalization.

---

## Primary user scenario

1. User hears that F1 is returning to Sepang.
2. User likes the idea but knows little or nothing about F1.
3. User opens SEPANG 56.
4. Landing explains the product and offers **Get Race Ready**.
5. User selects their F1 familiarity level.
6. The app recommends the appropriate Learn path.
7. User completes as much Learn content as they need and may reach **Race Ready**.
8. User enters **Meet Sepang**.
9. On first visit, the app introduces the circuit and recommends the guided explorer.
10. User explores Main Straight, T1, T4, T9, and T15, or explores freely.
11. User learns what happens at each selected location and why it matters.
12. User continues to Predictions when ready.
13. User completes eight predictions one question at a time.
14. User reviews all picks and edits any they want to change.
15. Authentication is requested only when saving/submitting requires persistence.
16. Submitted picks remain editable until the common race deadline.
17. Picks lock automatically when the deadline passes.
18. User creates or joins a private league.
19. User compares results with friends once predictions are scored.

---

## Core product loop

**Learn → Understand Sepang → Predict → Compete**

Nothing should interrupt or dilute this loop in MVP.

Learn and Sepang use soft progression rather than hard gating.

Predictions use a real deadline because fair competition requires all picks to become immutable before the race.

---

## MVP acceptance test

Give SEPANG 56 to someone who has never watched F1. After using it, they should be able to answer:

- What happens across an F1 race weekend?
- Why do tyres, pit stops, overtaking, flags, and the Safety Car matter?
- What are the key places to watch at Sepang?
- Who do you think will win or perform well?
- Can I compare my picks with friends?

If those outcomes work cleanly, the MVP is doing its job.
