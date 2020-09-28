import { Borrower } from "../../borrowers/shared/borrower";
import { OrderItem } from "./order-item";
import { OrderCycle } from "./order-cycle";

/**
 * Order of a borrower for an order cycle.
 *
 * An order contains the items a borrower has ordered for an order cycle.
 * A borrower may have at most one order per order cycle.
 */
export class Order {
  /** Unique id of the order. */
  id: number;

  /** Id of the order cycle the order belongs to. */
  cycle_id: number;

  /** Borrower owning this order. */
  borrower?:  Borrower;

  /** Cycle the order belongs to. */
  cycle?: OrderCycle;

  /** Ordered items. */
  items: OrderItem[];

  /** Number of order items. May be set if the not all items are returned. */
  item_count?: number;
}
