/**
 * Possible states of a OrderCycle.
 */
import { DateService } from "../../core/date-service";
import { Order } from "./order";

export enum OrderCycleState {
  UNKNOWN = 'UNKNOWN',
  SCHEDULED = 'SCHEDULED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

/**
 * Order cycle of the online/pick-up mode of the library.
 */
export class OrderCycle {
  /**
   * Unique id of the order cycle.
   *
   * Optional because the id is determined by the server and not set for new objects.
   */
  id?: number;

  /**
   * Start of the order window during which borrowers can edit orders.
   */
  order_window_start?: Date|string;

  /**
   * End of the order window during which borrowers can edit orders.
   */
  order_window_end?: Date|string;

  orders?: Order[];

  /**
   * Derives the state of this `OrderCycle` from the order window and the given current time.
   */
  getState(now: Date): OrderCycleState {
    const start: Date|undefined = DateService.toDate(this.order_window_start);
    const end: Date|undefined = DateService.toDate(this.order_window_end);
    if (start && now.getTime() < start.getTime()) {
      return OrderCycleState.SCHEDULED;
    }
    if (end && now.getTime() > end.getTime()) {
      return OrderCycleState.CLOSED;
    }
    if (start && end && now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
      return OrderCycleState.OPEN;
    }
    return OrderCycleState.UNKNOWN;
  }
}
