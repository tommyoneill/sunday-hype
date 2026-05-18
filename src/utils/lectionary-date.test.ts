import { describe, expect, it } from "vitest";

import {
  CALENDAR_DATE_REGEX,
  calendarDateStringToUtcDate,
  dateToCalendarDateString,
  formatLectserveDateFromCalendarString,
} from "./lectionary-date";

describe("CALENDAR_DATE_REGEX", () => {
  it("accepts YYYY-MM-DD", () => {
    expect(CALENDAR_DATE_REGEX.test("2025-05-17")).toBe(true);
  });

  it("rejects malformed strings", () => {
    expect(CALENDAR_DATE_REGEX.test("05-17-2025")).toBe(false);
    expect(CALENDAR_DATE_REGEX.test("2025-5-07")).toBe(false);
  });
});

describe("dateToCalendarDateString", () => {
  it("uses local calendar parts", () => {
    expect(dateToCalendarDateString(new Date(2025, 4, 7))).toBe("2025-05-07");
  });
});

describe("calendarDateStringToUtcDate", () => {
  it("parses UTC midnight for the calendar day", () => {
    const d = calendarDateStringToUtcDate("2025-07-04");
    expect(d.toISOString()).toBe("2025-07-04T00:00:00.000Z");
  });

  it("throws on bad input", () => {
    expect(() => calendarDateStringToUtcDate("nope")).toThrow('Invalid calendar date');
  });
});

describe("formatLectserveDateFromCalendarString", () => {
  it("returns the slug when valid", () => {
    expect(formatLectserveDateFromCalendarString("2025-12-31")).toBe("2025-12-31");
  });

  it("throws when invalid format", () => {
    expect(() => formatLectserveDateFromCalendarString("")).toThrow("Invalid Lectserve calendar date");
  });
});
