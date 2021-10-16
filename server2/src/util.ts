export function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export function identity<T>(x: T): T {
  return x;
}

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}