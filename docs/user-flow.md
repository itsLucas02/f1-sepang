# SEPANG 56 — User Flow & App Structure

## Main flow

```text
LANDING
   |
   v
F1 KNOWLEDGE CHECK
   |
   v
LEARN F1
   |
   v
UNDERSTAND SEPANG
   |
   v
MAKE PREDICTIONS
   |
   v
REVIEW PICKS
   |
   v
AUTH / SAVE
   |
   v
PICKS LOCKED
   |
   +-------------------+
   |                   |
   v                   v
CREATE LEAGUE       JOIN LEAGUE
   |                   |
   +---------+---------+
             |
             v
        LEADERBOARD
```

## Knowledge check

Options:

- **Nothing at all** — start from lesson 1
- **I know the basics** — allow skipping fundamentals
- **I watch F1** — allow direct path to Sepang / predictions

This should reduce friction without forcing experienced users through beginner material.

## App structure

Primary navigation:

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

## State model

### Per-user

- learningProgress
- sepangProgress
- predictions
- score
- leagues

### App/global

- lessons
- drivers
- teams
- sepangContent
- predictionQuestions
- raceResults
- leagues

## Minimal data model

```text
users
- id
- username
- avatar
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

Drivers, teams, lessons, and Sepang educational content may remain static in the codebase for MVP. Do not build a CMS unless scope changes explicitly.
