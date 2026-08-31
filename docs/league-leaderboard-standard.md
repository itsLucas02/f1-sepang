# SEPANG 56 — League & Leaderboard Standard

## Status

**Finalized MVP league and leaderboard mechanics.**

This document is the source of truth for private leagues, joining, ranking, and the global leaderboard.

Keep the system intentionally small. SEPANG 56 is not a social network.

---

## Purpose

Leagues let users compare their prediction score with friends or a community group.

A league is only a filtered leaderboard of members who share the same scoring system.

---

## Create league

Flow:

```text
SUBMITTED PICKS / LEADERBOARD
          ↓
      CREATE LEAGUE
          ↓
      Enter league name
          ↓
          CREATE
          ↓
 Generate unique join code
          ↓
 Creator becomes a member
          ↓
     LEAGUE LEADERBOARD
```

Required input:

- league name

Generated data:

- unique join code
- shareable league URL

Example:

```text
Kracked Devs
Code: KD7X4P
Route: /league/KD7X4P
```

Do not add league logos, descriptions, seasons, roles, moderators, approval queues, custom scoring, chat, feeds, or settings dashboards for MVP.

---

## Join league

Users may join by entering a code or opening a league invite URL.

```text
ENTER CODE / OPEN INVITE
          ↓
   League exists?
      ↙       ↘
    NO         YES
    ↓           ↓
 Show error   Auth if needed
    ↓           ↓
  Retry       Join league
                ↓
         LEAGUE LEADERBOARD
```

Joining the same league twice must not create duplicate membership.

A user may join multiple leagues.

---

## Authentication

Creating or joining a league requires authentication because membership must persist.

If an unauthenticated user opens a valid invite link:

```text
Invite link
   ↓
Sign in
   ↓
Return to invite
   ↓
Join league
```

The intended destination must survive the auth handoff.

---

## League leaderboard

A league leaderboard is simply the scores of league members sorted by score descending.

Example:

```text
KRACKED DEVS

1  Sarah   22
2  Lucas   19
2  Ahmad   19
4  Daniel  17
```

Use the scoring rules from `docs/scoring-standard.md`.

Ties remain ties and use competition ranking: `1, 2, 2, 4`.

Do not introduce tie breakers.

Before race results are scored, the leaderboard may show members with a pending/unscored state rather than inventing provisional rankings.

---

## Global leaderboard

MVP may include one global leaderboard using the same prediction scores.

It is not a separate scoring system or backend concept.

Conceptually:

```text
Leaderboard
├── Global
└── My Leagues
```

Private/friends leagues remain the primary social experience.

---

## Minimal data model

### `leagues`

```text
id
name
code
owner_id
created_at
```

### `league_members`

```text
league_id
user_id
joined_at
```

Enforce uniqueness for:

```text
league_id + user_id
```

Do not create extra tables for roles, invitations, league settings, seasons, or messages in MVP.

---

## Routes

Use:

```text
/leaderboard
/league/[code]
```

Create/join interactions can use Dialog/Form behavior inside the relevant screens. Separate `/league/create` and league-settings routes are not required for MVP.

---

## Implementation principle

A league should remain a thin membership layer over existing user scores.

Do not duplicate prediction submissions or scores per league. One user's race score is reused across every league they belong to.