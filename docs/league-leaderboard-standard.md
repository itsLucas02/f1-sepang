# SEPANG 56 — Global Leaderboard Standard

## Status

**Finalized MVP competition mechanics.**

This document is the source of truth for the single global SEPANG 56 leaderboard.

## Purpose

Everyone who submits picks competes on one community leaderboard. It reuses the one score calculated from that user's eight predictions.

There are no private leagues, join codes, invitations, memberships, league routes, or league management in MVP.

## Player flow

```text
SUBMITTED PICKS
       ↓
RACE RESULTS ENTERED ONCE
       ↓
SCORES CALCULATED
       ↓
GLOBAL LEADERBOARD
```

The leaderboard can show an unscored/pending state until the official result is entered. It must not invent provisional rankings.

## Ranking

Sort scored submissions by score descending. Ties use competition ranking:

```text
1, 2, 2, 4
```

Do not use submission time, account age, or any other tie breaker.

## Minimal data model

```text
profiles
prediction_submissions
race_results
```

`prediction_submissions.score` is the one authoritative score. Do not duplicate it into a competition, league, membership, or leaderboard table.

## Route

```text
/leaderboard
```

No `/league/[code]`, create/join dialog, invite link, or league settings route belongs in MVP.

## Implementation principle

Keep competition as one derived read of submitted picks and profiles after the one authoritative race result is entered. Do not add membership, invitation, social, or organization infrastructure.
