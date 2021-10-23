export function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export function identity<T>(x: T): T {
  return x;
}

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
};

/**
 * Returns the given date plus the days as a new date.
 */
export function addDays(date: Date, days: number): Date {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/**
 * Returns the `value` as an ISO string representation of a datetime without fractional
 * seconds and timezone, for example, `2020-08-15T10:30:30`.
 *
 * We use UTC as the mysql timezone (as default timezone on the server and connections).
 * This implies that `datetime` strings are interpreted as UTC when reading and writing
 * to the database.
 */
export function dateToIsoStringWithoutTimeZone(value: Date|string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().replace(/\.[0-9]*Z/, '');
}

