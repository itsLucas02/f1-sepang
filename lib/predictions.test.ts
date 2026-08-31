import { describe, expect, it } from "vitest";

import {
  getUnavailablePodiumDriverIds,
  isPredictionComplete,
  isPredictionLocked,
  parsePersistedPredictionDraft,
  setPredictionAnswer,
} from "@/lib/predictions";

describe("podium validation", () => {
  it("prevents the winner from being reused for second place", () => {
    expect(
      getUnavailablePodiumDriverIds("second", { winner: "norris" }),
    ).toEqual(["norris"]);
  });

  it("prevents winner and second place from being reused for third", () => {
    expect(
      getUnavailablePodiumDriverIds("third", {
        winner: "norris",
        second: "verstappen",
      }),
    ).toEqual(["norris", "verstappen"]);
  });

  it("clears a later podium answer when an earlier pick changes to that driver", () => {
    const answers = setPredictionAnswer(
      {
        winner: "norris",
        second: "verstappen",
        third: "leclerc",
      },
      "winner",
      "verstappen",
    );

    expect(answers.winner).toBe("verstappen");
    expect(answers.second).toBeUndefined();
    expect(answers.third).toBe("leclerc");
  });
});

describe("prediction completion", () => {
  it("treats false as a valid Yes/No answer", () => {
    expect(
      isPredictionComplete({
        winner: "norris",
        second: "verstappen",
        third: "leclerc",
        p1StarterWins: false,
        fastestLap: "piastri",
        rain: false,
        safetyCar: true,
        firstRetirement: "stroll",
      }),
    ).toBe(true);
  });
});

describe("prediction persistence", () => {
  it("filters invalid stored answers", () => {
    const parsed = parsePersistedPredictionDraft(
      JSON.stringify({
        answers: {
          winner: "norris",
          second: "not-a-driver",
          rain: true,
          madeUpQuestion: "anything",
        },
        currentQuestion: 2,
        hasSeenIntro: true,
      }),
    );

    expect(parsed).toEqual({
      answers: { winner: "norris", rain: true },
      currentQuestion: 2,
      hasSeenIntro: true,
    });
  });
});

describe("prediction deadline", () => {
  it("locks at or after the configured deadline", () => {
    const deadline = "2026-10-01T08:00:00.000Z";

    expect(isPredictionLocked(deadline, new Date("2026-10-01T07:59:59.000Z"))).toBe(false);
    expect(isPredictionLocked(deadline, new Date("2026-10-01T08:00:00.000Z"))).toBe(true);
  });

  it("stays editable when no deployment deadline is configured", () => {
    expect(isPredictionLocked(null, new Date("2030-01-01T00:00:00.000Z"))).toBe(false);
  });
});
