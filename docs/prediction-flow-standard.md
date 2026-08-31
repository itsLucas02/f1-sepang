# SEPANG 56 — Prediction Flow Standard

## Status

**Finalized core product flow.**

This document is the source of truth for the MVP Prediction journey: question order, draft behavior, review/edit behavior, authentication handoff, submission state, and the single race deadline model.

Scoring values and a few result-definition edge cases are intentionally not finalized here. Those must be resolved in the scoring standard before implementation treats them as settled.

---

## Purpose

Predictions turn what the user has learned into a simple race-weekend opinion they can later compare with friends.

The experience should feel lightweight and understandable even for a complete F1 beginner.

Core principles:

- exactly one prediction question per screen
- eight questions total for MVP
- no authentication required to begin
- answers are kept as a temporary draft while progressing
- users can move backward and edit answers
- users review all picks before saving/submitting
- saving/submitting may trigger authentication
- submitted picks remain editable until one common race deadline
- picks lock automatically when that deadline passes
- there is no irreversible user-operated `LOCK PICKS` action before the deadline

---

## Final MVP question set

The Prediction flow contains exactly these eight questions:

1. **Race Winner** — choose one driver
2. **Second Place** — choose one driver
3. **Third Place** — choose one driver
4. **Will the driver starting P1 win the race?** — Yes / No
5. **Fastest Lap** — choose one driver
6. **Rain during the race?** — Yes / No
7. **Safety Car during the race?** — Yes / No
8. **First Retirement** — choose one driver

`Pole Position` is **not** part of the finalized MVP question set.

Reason: SEPANG 56 uses one common deadline before the race. Pole position is already known after qualifying, so it would not be a fair prediction under the chosen deadline model.

---

## Primary flow

```text
SEPANG READY / NAVIGATION
          ↓
    MAKE YOUR PICKS
          ↓
   PREDICTION INTRO
          ↓
01 — RACE WINNER
          ↓
02 — SECOND PLACE
          ↓
03 — THIRD PLACE
          ↓
04 — WILL P1 STARTER WIN?
          ↓
05 — FASTEST LAP
          ↓
06 — RAIN?
          ↓
07 — SAFETY CAR?
          ↓
08 — FIRST RETIREMENT
          ↓
  PREDICTION SUMMARY
          ↓
      EDIT PICKS?
       ↙      ↘
     YES      NO
      ↓        ↓
  EDIT STEP  SAVE / SUBMIT
                ↓
          AUTH IF NEEDED
                ↓
       SUBMITTED / EDITABLE
                ↓
          RACE DEADLINE
                ↓
              LOCKED
```

---

## Prediction intro

Before Question 01, give the user a short orientation.

It should communicate:

- there are eight picks
- one question appears at a time
- answers can be changed before the deadline
- the user does not need an account just to start
- picks become locked automatically when the prediction deadline arrives

Do not overwhelm the intro with scoring rules or legal-style detail.

---

## Draft behavior

Before submission, answers exist as a temporary prediction draft.

Suggested application state:

```ts
type PredictionDraft = {
  answers: Record<string, PredictionAnswer>
  currentQuestion: number
}
```

The draft should survive normal forward/backward navigation within the flow.

Where practical, anonymous draft state may be persisted in browser storage so accidental refresh/navigation does not immediately destroy the user's work. The specific storage implementation is an engineering choice as long as it does not introduce unnecessary backend complexity before auth.

---

## One question per screen

Every question uses the reusable `PredictionStep` shell:

```text
PredictionStep
├── progress label      e.g. 01 / 08
├── question heading
├── short beginner explanation
├── answer control
└── Back / Next action region
```

Question-specific answer controls may differ, but the shell remains consistent.

Examples:

- driver question → `DriverCard` selection backed by RadioGroup semantics
- Yes / No question → two custom SEPANG choice controls backed by RadioGroup semantics

`NEXT` remains disabled until the current question has a valid answer.

Users may navigate backward and change an earlier answer.

---

## Podium validation

Questions 01–03 together form the predicted podium.

The same driver cannot occupy more than one podium position.

Required behavior:

```text
P1 selected
    ↓
P1 driver unavailable for P2
    ↓
P1 + P2 drivers unavailable for P3
```

If an earlier podium answer is changed, later podium validation must update accordingly.

The UI may disable or clearly mark already-used drivers. Do not silently accept duplicate podium choices.

---

## Prediction summary

After Question 08, show one review screen containing all eight answers.

The summary must allow the user to:

- inspect every pick
- jump directly back to any prediction step to edit it
- return to the summary after editing
- save/submit when satisfied

The summary is still editable while the prediction deadline has not passed.

Do not ask the user to authenticate before they have reached this point unless another explicitly approved persistence/social action requires it.

---

## Authentication handoff

Auth occurs late.

Primary path:

```text
ANONYMOUS PREDICTION DRAFT
          ↓
PREDICTION SUMMARY
          ↓
SAVE / SUBMIT PICKS
          ↓
AUTH REQUIRED?
    ↙           ↘
  YES            NO
   ↓              ↓
SIGN IN        PERSIST
   ↓
RETURN TO SAME DRAFT
   ↓
PERSIST
```

**Critical requirement:** authentication must not erase or reset the user's completed draft.

The exact auth provider and account implementation are documented/finalized separately from this prediction flow.

---

## Final deadline model

SEPANG 56 uses **one common prediction deadline before the race**.

There are no separate qualifying and race lock windows in MVP.

The exact configured timestamp may vary by event deployment, but product behavior is always:

```text
BEFORE DEADLINE
- draft allowed
- submit allowed
- submitted picks editable

AT / AFTER DEADLINE
- picks become locked automatically
- no answer editing
- summary becomes read-only
```

The application should derive lock state from the configured deadline rather than relying on a user clicking a permanent lock button.

---

## Prediction lifecycle states

Use three conceptual states:

```text
DRAFT
  ↓
SUBMITTED / EDITABLE
  ↓
LOCKED
```

### `DRAFT`

- answers may be incomplete
- may exist anonymously
- not yet persisted as the user's official submission

### `SUBMITTED / EDITABLE`

- official saved prediction set exists
- user may still change and resubmit/edit answers while before the deadline
- this is **not** considered locked

### `LOCKED`

- deadline has passed
- answers are read-only
- scoring can use the locked prediction set

Do not model `submitted` and `locked` as the same product state.

---

## Question-specific rules that are already fixed

### 01 — Race Winner

Single-driver choice.

### 02 — Second Place

Single-driver choice, excluding the selected Race Winner.

### 03 — Third Place

Single-driver choice, excluding the selected Race Winner and Second Place driver.

### 04 — Will the driver starting P1 win the race?

Simple Yes / No choice.

This asks whether the driver who starts the race from first position ultimately wins the race. The user does not need to choose the driver's identity in this question.

### 05 — Fastest Lap

Single-driver choice.

### 06 — Rain during the race?

Yes / No.

The exact official condition that qualifies as `Yes` must be finalized in the scoring/result-definition standard.

### 07 — Safety Car during the race?

Yes / No.

Whether a Virtual Safety Car counts must be finalized in the scoring/result-definition standard. Do not invent that rule during implementation.

### 08 — First Retirement

Single-driver choice.

DNS/DNF and simultaneous/ambiguous retirement handling must be finalized in the scoring/result-definition standard.

---

## Beginner explanations

Any F1-specific term must be explained briefly at first use.

Examples:

- **P1 / starting P1** → the driver starting the race from first place on the grid
- **Fastest Lap** → the driver who records the quickest single lap during the race
- **Safety Car** → a controlled period used when racing conditions are unsafe
- **Retirement** → a driver who stops competing before finishing the race

Keep explanations short enough that the Prediction flow still feels like making picks, not returning to Race School.

---

## Responsive behavior

The flow remains logically identical across desktop and mobile.

### Desktop

- one question per page
- wider answer region
- driver choices may use portrait-rich `DriverCard` presentation

### Mobile

Use the approved `docs/mobile-prediction-standard.md` composition:

- `RaceFlowHeader`
- `01 / 08` progress
- one question
- compact two-column text-first driver cards where applicable
- sticky full-width `NEXT`

Responsive presentation may differ, but question order, answers, validation, and lifecycle rules must not differ by viewport.

---

## State model

Suggested conceptual state:

```ts
type PredictionStatus = "draft" | "submitted" | "locked"

type PredictionState = {
  answers: Record<PredictionQuestionId, PredictionAnswer>
  currentQuestion: number
  status: PredictionStatus
  submittedAt?: string
  updatedAt?: string
  deadlineAt: string
}
```

`locked` should be determined/validated from the authoritative deadline on the backend for persisted submissions. Client UI may mirror that state but must not be the sole authority for enforcing the deadline.

---

## Out of scope for this flow

Do not add:

- confidence percentages
- betting odds
- wagering
- prediction markets
- AI-generated predictions
- AI advice on who to pick
- fantasy-team mechanics
- per-question social comments
- live telemetry
- live odds
- multiple prediction deadlines
- irreversible manual lock button

---

## Still unresolved — scoring phase

The following are intentionally deferred to the scoring/competition finalization:

- points awarded per question
- whether some questions are weighted more heavily
- tie-breaking rules
- authoritative race-result source / result-entry mechanism
- post-race result corrections
- exact definition of `rain during the race`
- whether VSC counts for the Safety Car question
- DNS / DNF / ambiguous first-retirement handling

Codex/OpenCode must not invent these rules.

---

## Final validation checklist

A correct MVP implementation must satisfy all of these:

- exactly eight finalized prediction questions
- no Pole Position question
- one question per screen
- podium selections cannot duplicate drivers
- anonymous user can complete a temporary draft
- summary appears before persistence
- auth handoff preserves the draft
- submitted picks remain editable before the deadline
- one common pre-race deadline
- automatic read-only lock after deadline
- `submitted` and `locked` are distinct states
- no AI prediction advice
- no betting/fantasy mechanics
- unresolved scoring edge cases are not guessed
