/** Canonical YYYY-MM-DD for Lectserve URLs and stable DB lookups (UTC midnight for that calendar day). */

export const CALENDAR_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function calendarDateSchemaMessage(): string {
  return "YYYY-MM-DD";
}

/** Local calendar components as YYYY-MM-DD (use for wiring client dates to API). */
export function dateToCalendarDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Validates and converts a calendar date string to `Date` at UTC midnight for that day.
 */
export function calendarDateStringToUtcDate(dateStr: string): Date {
  if (!CALENDAR_DATE_REGEX.test(dateStr)) {
    throw new Error(`Invalid calendar date: "${dateStr}"`);
  }

  const [y, m, d] = dateStr.split("-").map(Number);

  const year = y ?? 0;
  const month = m ?? 0;
  const day = d ?? 0;

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid calendar date components: "${dateStr}"`);
  }

  return new Date(Date.UTC(year, month - 1, day));
}

/** Same as calendar input / Lectserve path segment (`/date/YYYY-MM-DD`). */
export function formatLectserveDateFromCalendarString(dateStr: string): string {
  if (!CALENDAR_DATE_REGEX.test(dateStr)) {
    throw new Error(`Invalid Lectserve calendar date: "${dateStr}"`);
  }

  return dateStr;
}
