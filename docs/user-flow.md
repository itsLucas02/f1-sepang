# SEPANG 56 — User Flow & App Structure

## Product flow principle

SEPANG 56 guides users through:

**Learn → Understand Sepang → Make Predictions → Compete With Friends**

This is a guided path, not a hard lock. Users may skip ahead, but beginners should be gently encouraged to follow the sequence.

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
                    │ KNOWLEDGE CHECK      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼──────────────┐
                 │             │              │
              NOTHING        BASICS          FAN
                 │             │              │
                 ▼             ▼              │
          FULL LEARNING    SHORT REFRESH      │
                 │             │              │
                 └──────┬──────┘              │
                        │                     │
                        └──────────┬──────────┘
                                   ▼
                        ┌────────────────────┐
                        │  UNDERSTAND SEPANG │
                        └─────────┬──────────┘
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

## Knowledge check mechanism

### Important: this does **not** use AI

The knowledge check is simple deterministic application logic.

The user selects one of three predefined options:

1. **Nothing at all**
2. **I know the basics**
3. **I watch F1 / I already know F1**

The selected value is stored as a small state value, for example:

```ts
knowledgeLevel = "new" | "basic" | "fan"
```

The app then uses normal conditional logic to choose the recommended next screen.

Example:

```ts
if (knowledgeLevel === "new") {
  nextPath = "/learn?track=full"
}

if (knowledgeLevel === "basic") {
  nextPath = "/learn?track=refresher"
}

if (knowledgeLevel === "fan") {
  nextPath = "/sepang"
}
```

No model inference, chatbot, recommendation engine, or AI reasoning is required.

### Branch behaviour

#### Nothing at all

Recommended path:

```text
Knowledge Check
      ↓
Nothing at all
      ↓
Full beginner learning track
      ↓
Understand Sepang
```

Show all core beginner lessons.

#### I know the basics

Recommended path:

```text
Knowledge Check
      ↓
I know the basics
      ↓
Short refresher
      ↓
Understand Sepang
```

The refresher should contain only the concepts most relevant to enjoying and predicting the Sepang race, such as:

- race weekend structure
- qualifying / starting grid
- pit stops and tyres
- flags / Safety Car
- overtaking basics

The user can still open any skipped beginner lesson manually.

#### I watch F1 / I know F1

Recommended path:

```text
Knowledge Check
      ↓
I know F1
      ↓
Skip beginner learning
      ↓
Understand Sepang
```

The user is taken directly to the Sepang section, with Learn still available in navigation.

### Soft progression, not hard gates

The knowledge branch is only a recommended route.

Do **not** prevent users from visiting Learn, Sepang, Predict, or Leaderboard because they skipped lessons.

Example:

A beginner who goes directly to Predict may see a lightweight prompt such as:

> New to F1? Race School can help you make more informed picks.

But the app must not block them.

---

## First-time user flow

```text
LANDING
  ↓
GET RACE READY
  ↓
KNOWLEDGE CHECK
  ↓
RECOMMENDED LEARNING PATH
  ↓
UNDERSTAND SEPANG
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

Auth should happen late, after the user has already experienced value and created predictions.

Users may browse lessons and make temporary predictions before signing in.

---

## Learn flow

For a full beginner track:

```text
What is F1?
  ↓
Drivers & Teams
  ↓
How a Race Weekend Works
  ↓
Qualifying & Starting Grid
  ↓
Tyres & Pit Stops
  ↓
Flags & Safety Car
  ↓
Overtaking Basics
  ↓
F1 BASICS COMPLETE
```

Guidelines:

- one main concept per screen
- short, visual explanations
- avoid long article-style pages
- simple progress indicator
- primary CTA: **Got it →**

---

## Sepang flow

```text
MEET SEPANG
  ↓
Circuit Overview
  ↓
Why Sepang Is Special
  ↓
Key Corners / Hotspots
  ↓
Main Straight & Overtaking Areas
  ↓
Heat & Tropical Rain
  ↓
Sepang F1 History
  ↓
SEPANG COMPLETE
  ↓
MAKE YOUR PICKS
```

This section should be more exploratory than the Learn section. A circuit SVG with clickable hotspots is preferred for MVP.

---

## Prediction flow

Use one question per screen.

```text
1 / 8 — Race Winner
  ↓
2 / 8 — Second Place
  ↓
3 / 8 — Third Place
  ↓
4 / 8 — Pole Position
  ↓
5 / 8 — Fastest Lap
  ↓
6 / 8 — Rain During Race?
  ↓
7 / 8 — Safety Car?
  ↓
8 / 8 — First Retirement
  ↓
PREDICTION SUMMARY
```

Every F1-specific term should have a short beginner-friendly explanation where needed.

### Prediction deadline logic

```text
Has prediction deadline passed?
        ↓
    ┌───┴───┐
   NO      YES
   ↓         ↓
Editable   Read-only
picks      locked picks
```

Whether "locked" picks may still be edited before the deadline is a product decision to finalize later. Do not invent a rule during implementation without explicit direction.

---

## League mechanism

A **league** is a private prediction leaderboard for a group of friends or community members.

It is not an F1 racing league and does not simulate races.

Example:

A KrackedDevs member creates a league called **KrackedDevs**. SEPANG 56 generates a join code or shareable link. Friends join the same league, submit their own race predictions, and are ranked by prediction score once results are entered.

### Create league

```text
Picks Locked
  ↓
Create League
  ↓
Enter League Name
  ↓
Create
  ↓
Generate Join Code / Share Link
  ↓
League Leaderboard
```

Example code:

```text
KD56-X7KQ
```

### Join league

```text
Join League
  ↓
Enter Code / Open Invite Link
  ↓
League exists?
  ↓
YES → Join → Leaderboard
NO  → Show error → Retry
```

A user may join multiple leagues.

For MVP, a league needs only:

- name
- owner
- join code
- members
- member scores
- leaderboard ranking

No chat, feed, messaging, team management, or social network features.

---

## Returning-user flow

After the first visit, the user's main experience should focus on their progress and competition rather than replaying onboarding.

Suggested returning-user dashboard:

```text
WELCOME BACK

Your Sepang Readiness
██████████░░ 80%

F1 Basics        ✓
Sepang Guide      ✓
Predictions       LOCKED
KrackedDevs       #4

[ VIEW PICKS ]
[ VIEW LEAGUE ]
```

This dashboard concept is not yet a mandatory MVP screen until explicitly finalized, but implementation should leave room for it.

---

## Primary navigation

- Learn
- Sepang
- Predict
- Leaderboard
- Profile

Suggested routes:

```text
/
/learn
/sepang
/predict
/leaderboard
/league/[code]
/profile
```

Keep lesson progression inside `/learn` unless route-level deep linking later proves useful.

---

## State model

### Per-user

- `knowledgeLevel`
- `learningProgress`
- `sepangProgress`
- `predictions`
- `score`
- `leagues`

### App/global

- `lessons`
- `drivers`
- `teams`
- `sepangContent`
- `predictionQuestions`
- `raceResults`
- `leagues`

---

## Minimal data model

```text
users
- id
- username
- avatar
- knowledge_level
- created_at

learning_progress
- user_id
- lesson_id
- completed

prediction_questions
- id
- type
- title
- description
- points_available

predictions
- id
- user_id
- question_id
- answer
- points

leagues
- id
- name
- code
- owner_id

league_members
- league_id
- user_id

race_results
- question_id
- correct_answer
```

Before authentication, `knowledgeLevel`, progress, and temporary prediction state may live in browser state/local storage. Once the user authenticates, relevant state can be persisted to the backend.

Drivers, teams, lessons, and Sepang educational content may remain static in the codebase for MVP. Do not build a CMS unless scope changes explicitly.
