# SEPANG 56 — Scoring Standard

## Status

**Finalized MVP scoring rules.**

This document is the source of truth for scoring submitted predictions after the race.

Keep this system simple. Do not add partial credit, weighted confidence, streaks, multipliers, bonus questions, submission-time tie breakers, or automated result-ingestion systems unless scope changes explicitly.

---

## Scoring table

| Prediction | Points |
| --- | ---: |
| Race Winner | 5 |
| Second Place | 4 |
| Third Place | 3 |
| Will the P1 starter win? | 2 |
| Fastest Lap | 3 |
| Rain during the race? | 2 |
| Safety Car during the race? | 2 |
| First Retirement | 4 |
| **Maximum** | **25** |

---

## Core rule

Every question is exact-match scoring:

```text
Correct answer → full points
Wrong answer   → 0 points
```

There is no partial credit.

Example:

```text
Prediction: P1 Norris, P2 Verstappen, P3 Leclerc
Result:     P1 Norris, P2 Leclerc, P3 Verstappen

Winner       correct → +5
Second Place wrong   → +0
Third Place  wrong   → +0
```

Being somewhere on the podium is not enough. P1, P2, and P3 are exact-position predictions.

---

## Simple result definitions

For MVP, use plain post-race answers:

- **Race Winner** — official race winner
- **Second Place** — official P2
- **Third Place** — official P3
- **P1 starter wins?** — whether the driver who started P1 won the race
- **Fastest Lap** — official fastest-lap driver
- **Rain** — whether it rained during the race
- **Safety Car** — whether the Safety Car was deployed during the race
- **First Retirement** — first driver to retire from the race

Do not build an edge-case rules engine. If an unusual real-world case creates ambiguity, resolve that specific case when it actually exists.

---

## Result entry

MVP does not need an admin CMS, live timing connection, FIA API integration, or automated scoring pipeline.

After the race, enter one authoritative result object manually using official post-race results as the reference.

Conceptually:

```ts
raceResult = {
  winner: "driver-id",
  second: "driver-id",
  third: "driver-id",
  poleStarterWon: true,
  fastestLap: "driver-id",
  rain: true,
  safetyCar: false,
  firstRetirement: "driver-id",
}
```

The scoring function compares each submitted answer against this object and stores the resulting total score.

---

## Ties

Ties are allowed and remain ties.

Use competition ranking:

```text
1  Sarah   22
2  Lucas   19
2  Ahmad   19
4  Daniel  17
```

Do not use submission time, account age, random ordering, or any other artificial tie breaker.

---

## Implementation rule

The scoring function should be a small deterministic pure function that can be unit tested independently from UI and database code.

Do not create a generic scoring framework for future race formats. The MVP has exactly eight known predictions and a maximum score of 25.