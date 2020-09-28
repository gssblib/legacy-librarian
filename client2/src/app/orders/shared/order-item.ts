import { Item } from "../../items/shared/item";

/**
 * Item ordered by a borrower during the order window of an order cycle.
 *
 * This is currently a wrapper around the ordered item but may later get
 * more data such as the status of the ordered item.
 */
export class OrderItem {
  item: Item;
}
