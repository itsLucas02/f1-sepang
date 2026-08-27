# SEPANG 56 — Learn Flow Standard

## Status

**Finalized product flow.**

This document is the source of truth for the MVP Learn journey. It defines routing, progression, completion, and product behavior. Detailed lesson copy and illustrations may still be refined, but implementation must not change the flow without explicit product approval.

---

## Purpose

Learn exists to get a complete Formula 1 beginner comfortable enough to understand and enjoy the Sepang race.

It is **not** intended to teach all of Formula 1.

Target experience:

- roughly 10–15 minutes for the full beginner path
- short, visual lessons
- one main idea at a time
- beginner language before specialist terminology
- no AI tutor or chatbot
- no forced gamification

The progression is:

```text
LANDING
   ↓
GET RACE READY
   ↓
F1 FAMILIARITY CHECK
   ↓
RECOMMENDED LEARN PATH
   ↓
RACE READY
   ↓
MEET SEPANG
```

---

## Familiarity check

The familiarity check is self-selection, not a scored quiz.

Prompt:

**How familiar are you with F1?**

Approved options:

1. **I'm completely new**
2. **I know some basics**
3. **I already follow F1**

Suggested application state:

```ts
type KnowledgeLevel = "beginner" | "basics" | "fan"
```

No AI inference, recommendation model, or hidden knowledge score is used.

---

## Branching behavior

### Beginner

Recommended lessons:

```text
01 Race Weekend
   ↓
02 How the Race Works
   ↓
03 Overtaking
   ↓
04 Tyres & Pit Stops
   ↓
05 Flags & Safety Car
   ↓
06 How to Watch
   ↓
RACE READY
```

### Basics

Recommended lessons:

```text
03 Overtaking
   ↓
04 Tyres & Pit Stops
   ↓
05 Flags & Safety Car
   ↓
06 How to Watch
   ↓
RACE READY
```

Lessons 01 and 02 remain visible and available at all times.

### Fan

Recommended next step:

```text
FAMILIARITY CHECK
   ↓
I ALREADY FOLLOW F1
   ↓
MEET SEPANG
```

All Learn lessons remain accessible from navigation.

---

## Approved lesson set

### 01 — Race Weekend

Teach the basic structure of an F1 weekend:

- Practice
- Qualifying
- Race
- why qualifying determines the starting order

### 02 — How the Race Works

Teach the minimum needed to follow the race itself:

- starting grid
- laps / race distance
- positions
- finishing order
- P1 wins

Championship points may be introduced only as secondary context.

### 03 — Overtaking

Teach the beginner concepts that help users understand racing at Sepang:

- why overtaking is difficult
- braking zones
- slipstream
- DRS at a simple level

### 04 — Tyres & Pit Stops

Teach:

- Soft / Medium / Hard tyres
- faster versus longer-lasting tyre choices
- why drivers pit
- what a pit stop changes

Do not turn this into a tyre-strategy simulator.

### 05 — Flags & Safety Car

Teach the race-control events most likely to confuse a newcomer:

- yellow flag
- red flag
- blue flag
- chequered flag
- Safety Car

Keep explanations practical and visual.

### 06 — How to Watch

Bridge Learn into the Sepang experience.

Teach the user what to pay attention to during a race:

- the start
- gaps between cars
- tyre choices
- pit stops
- overtaking areas
- Safety Car moments
- final laps

End by directing the user to **Meet Sepang**.

---

## Lesson interaction pattern

Each lesson should follow a compact learning loop:

```text
LESSON TITLE
   ↓
SHORT EXPLANATION
   ↓
VISUAL / INTERACTION WHERE USEFUL
   ↓
GOT IT / CONTINUE
   ↓
MARK LESSON COMPLETE
```

Guidelines:

- avoid article-length pages
- do not require a test after every lesson
- progression should feel lightweight
- the user may revisit any lesson
- completion state should be visible but not game-like

Three.js is used only where already approved in `docs/threejs-experience.md`; most Learn UI remains normal application UI.

---

## Soft progression

Learn is a recommendation system, not a hard gate.

Users may manually open:

- Learn
- Sepang
- Predict
- Leaderboard

without completing the recommended Learn path.

Do not prevent access because a lesson is incomplete.

A lightweight recommendation may be shown, but it must not become a blocking modal or forced onboarding sequence.

---

## Race Ready

`Race Ready` is a milestone shown when all lessons recommended for the user's selected knowledge level have been completed.

Suggested state:

```ts
const raceReady = recommendedLessonIds.every(
  (lessonId) => completedLessonIds.has(lessonId)
)
```

Approved completion treatment:

```text
RACE READY

You know enough to follow the action.

[ MEET SEPANG → ]
```

`Race Ready` is **not permission to continue**. Users may visit Sepang before earning it.

For `fan`, no beginner lesson is required before continuing to Sepang.

---

## Minimal state model

```ts
type LearnState = {
  knowledgeLevel: "beginner" | "basics" | "fan"
  recommendedLessonIds: string[]
  completedLessonIds: Set<string>
  raceReady: boolean
}
```

The recommendation mapping must be deterministic and inspectable.

No LLM or external service is required.

---

## Implementation boundaries

Do not add:

- AI tutor/chatbot
- adaptive AI curriculum
- XP
- levels
- streaks
- badges
- achievements
- mandatory quizzes
- hard progression gates
- long encyclopedic F1 lessons

If a future feature changes the Learn journey, update this document before implementation.
