# SEPANG 56 — Auth & Persistence Standard

## Status

**Finalized MVP auth and persistence rules.**

This document is the source of truth for when authentication is required, what anonymous state is kept locally, what is persisted to Supabase, and the minimal database model.

Keep the implementation KISS/YAGNI. Do not expand auth/provider choices or normalize the database beyond what the MVP needs.

---

## Auth principle

Users must be able to experience value before creating an account.

Authentication is **not required** for:

- Landing
- Learn
- Sepang Circuit Explorer
- completing the eight Prediction questions
- viewing the Prediction Summary

Authentication **is required** when the user attempts to:

- save/submit picks

---

## Auth provider

Use:

- Supabase Auth
- Google OAuth only for MVP

Do not add password auth, forgot-password flows, email verification UX, magic links, or additional social providers unless product scope changes.

---

## Prediction auth handoff

Flow:

```text
Anonymous user
      ↓
Makes 8 picks
      ↓
Prediction Summary
      ↓
SAVE PICKS
      ↓
Google sign-in
      ↓
Return to Prediction Summary
      ↓
Persist draft
      ↓
SUBMITTED / EDITABLE UNTIL DEADLINE
```

The prediction draft must survive authentication.

Do not redirect the user to a generic dashboard and lose their place.

---

## Anonymous/local state

Before authentication, browser storage may hold:

```text
knowledgeLevel
completedLessonIds
visitedHotspots
predictionDraft
```

Use simple local storage or equivalent client persistence. Do not introduce a client database or complex offline-sync layer.

Local state is convenience state, not authoritative competition state.

---

## Persisted state

After authentication, persist the data required for continuity and competition.

Minimal user-facing progress may be synchronized to Supabase:

```text
knowledge_level
completed_lessons
visited_hotspots
```

Predictions and scores must be persisted because they affect competition.

---

## Minimal database model

### `profiles`

```text
id              uuid / auth user id
display_name
avatar_url
knowledge_level
completed_lessons
visited_hotspots
created_at
```

`completed_lessons` and `visited_hotspots` may be simple arrays/JSON for MVP. Do not create progress tables unless the implementation genuinely requires them.

### `prediction_submissions`

One submission row per user for this MVP event.

```text
user_id
answers           json/jsonb
score
status            draft | submitted
submitted_at
updated_at
```

The answer object contains the eight finalized prediction keys from `docs/prediction-flow-standard.md`.

Do not create a generic `prediction_questions` table or one row per answer unless a concrete implementation need appears.

### `race_results`

For MVP, store one authoritative result object with the eight final answers needed by the scoring function.

Conceptually:

```text
id
answers json/jsonb
finalized_at
```

No admin CMS is required.

---

## Prediction deadline

Use one configured value:

```text
predictionDeadline
```

Before the deadline:

- draft/submitted picks may be edited
- authenticated submitted picks can be updated

At/after the deadline:

- prediction writes are rejected
- submitted picks are read-only
- UI shows `LOCKED`

No cron job is necessary merely to change a stored status to `locked`. The app/server can derive lock state from the configured deadline.

The server/database write path must enforce the deadline; do not rely only on disabling the client UI.

---

## Supabase security

Use normal Supabase Row Level Security for user-owned data.

At minimum:

- users can read/update their own profile
- users can read/write their own prediction submission before the deadline
- race results are not writable by normal users

Keep policies small and explicit.

---

## Auth callback route

Use:

```text
/auth/callback
```

Preserve a small return destination so auth can send users back to Prediction Summary.

Do not build a general-purpose account portal for MVP.

---

## Implementation principle

Authentication exists only to persist meaningful user/competition state.

Do not force auth earlier than necessary, and do not let auth complexity interrupt the core flow:

**Learn → Understand Sepang → Predict → Compete**.
