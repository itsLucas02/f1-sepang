import { describe, expect, it } from "vitest";

import { parseDisplayName } from "@/lib/profile";

describe("parseDisplayName", () => {
  it("normalizes a valid public name and rejects invalid values", () => {
    expect(parseDisplayName("  Dream   Racer  ")).toBe("Dream Racer");
    expect(parseDisplayName("A")).toBeNull();
    expect(parseDisplayName("x".repeat(25))).toBeNull();
  });
});
