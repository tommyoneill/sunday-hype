import { describe, expect, it } from "vitest";

import { parseLectserveResponse } from "./lectserve-parse";

describe("parseLectserveResponse", () => {
  it("parses readings and week name", () => {
    const result = parseLectserveResponse({
      red_letter: {
        services: [{ name: "Fifth Week of Lent", readings: ["A", "B", "C", "D"] }],
      },
    });
    expect(result).toEqual({
      ok: true,
      weekName: "Fifth Week of Lent",
      firstReading: "A",
      psalm: "B",
      epistle: "C",
      gospel: "D",
    });
  });

  it("returns missing_service when envelope is empty", () => {
    expect(parseLectserveResponse({})).toEqual({ ok: false, code: "missing_service" });
  });

  it("returns empty_readings when list is zero length", () => {
    const result = parseLectserveResponse({
      red_letter: { services: [{ name: "Some Week", readings: [] }] },
    });
    expect(result).toEqual({ ok: false, code: "empty_readings" });
  });

  it("pads missing slots with placeholders when Lectserve sends partial readings", () => {
    const result = parseLectserveResponse({
      red_letter: { services: [{ readings: ["only-first"] }] },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected ok parsing result");
    }
    expect(result.weekName).toBe("Unknown Week");
    expect(result.firstReading).toBe("only-first");
    expect(result.psalm).toContain("No readings");
    expect(result.gospel).toContain("No readings");
  });
});
