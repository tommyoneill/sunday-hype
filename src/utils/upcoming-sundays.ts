/**
 * Normalizes `Date` to local calendar midnight (no time-of-day / DST surprises for UI buckets).
 */
export function createLocalCalendarDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Next four Sundays anchored to local `now` (inclusive when `now` is a Sunday). */
export function getUpcomingSundays(now: Date): Date[] {
  const sundays: Date[] = [];
  const today = createLocalCalendarDate(now);

  for (let i = 0; i < 4; i++) {
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + i * 7);
    sundays.push(createLocalCalendarDate(nextSunday));
  }

  return sundays;
}
