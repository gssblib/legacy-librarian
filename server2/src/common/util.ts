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
