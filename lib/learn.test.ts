import { describe, expect, it } from "vitest";

import {
  getNextRecommendedLessonId,
  getRecommendedLessonIds,
  isRaceReady,
  parsePersistedLearnState,
} from "./learn";

describe("learn recommendations", () => {
  it("recommends all six lessons to beginners", () => {
    expect(getRecommendedLessonIds("beginner")).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
  });

  it("recommends lessons 03 through 06 to basics users", () => {
    expect(getRecommendedLessonIds("basics")).toEqual(["03", "04", "05", "06"]);
  });

  it("does not require beginner lessons for fans", () => {
    expect(getRecommendedLessonIds("fan")).toEqual([]);
    expect(isRaceReady("fan", [])).toBe(true);
  });
});

describe("race ready", () => {
  it("becomes true only when every recommended lesson is complete", () => {
    expect(isRaceReady("basics", ["03", "04", "05"])).toBe(false);
    expect(isRaceReady("basics", ["03", "04", "05", "06"])).toBe(true);
  });

  it("ignores optional lesson completion when finding the next recommendation", () => {
    expect(getNextRecommendedLessonId("basics", ["01", "03"], "03")).toBe("04");
  });
});

describe("stored learn state", () => {
  it("falls back safely when stored state is invalid", () => {
    expect(parsePersistedLearnState("not-json")).toEqual({
      knowledgeLevel: null,
      completedLessonIds: [],
    });
  });

  it("filters invalid lesson ids from stored state", () => {
    expect(
      parsePersistedLearnState(
        JSON.stringify({
          knowledgeLevel: "beginner",
          completedLessonIds: ["01", "01", "99"],
        }),
      ),
    ).toEqual({
      knowledgeLevel: "beginner",
      completedLessonIds: ["01"],
    });
  });
});
