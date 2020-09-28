import { Injectable } from "@angular/core";

@Injectable()
export class DateService {

  now() {
    return new Date();
  }

  daysAgo(days: number) {
    return DateService.addDays(this.now(), -days)
  }

  yesterday() {
    return this.daysAgo(1);
  }

  /**
   * Returns a copy of the 'date' shifted by the number of 'days'.
   */
  static addDays(date: Date, days: number) {
    const result = new Date(date.getTime());
    result.setDate(date.getDate() + days);
    return result;
  }

  static toDate(value?: string|Date): Date|undefined {
    if (!value) {
      return undefined;
    }
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  static toString(value?: string|Date): string|undefined {
    const date = DateService.toDate(value);
    return date?.toISOString();
  }
}
