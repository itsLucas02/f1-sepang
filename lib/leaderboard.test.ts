import { describe, expect, it } from "vitest";

import { rankParticipants } from "@/lib/leaderboard";

describe("rankParticipants", () => {
  it("uses competition ranking for tied scores", () => {
    expect(rankParticipants([
      { displayName: "A", score: 20 },
      { displayName: "B", score: 15 },
      { displayName: "C", score: 15 },
      { displayName: "D", score: 10 },
    ]).map(({ rank }) => rank)).toEqual([1, 2, 2, 4]);
  });
});
