import { Checkout } from "./checkout";
import { ItemState } from "./item-state";
import { Availability, ItemStatus } from "./item-status";
import { Borrower } from '../../borrowers/shared/borrower';
import { OrderItem } from "../../orders/shared/order-item";

/**
 * Represents an item (as stored in the database).
 */
export class Item {
  id: number;
  barcode: string;
  antolin: string;
  author: string;
  title: string;
  category: string;
  subject: string;
  publicationyear: number;
  publisher: string;
  age: string;
  serial: string;
  seriestitle: string;
  classification: string;
  isbn10: string;
  isbn13: string;
  state: ItemState;
  checkout?: Checkout;
  order_item?: OrderItem;
  history: Array<any>;
  borrower?: Borrower;
  added?: Date|string;
  availability?: Availability;

  get status(): ItemStatus {
    if (this.state !== ItemState.CIRCULATING) {
      return ItemStatus[this.state];
    }
    if (this.checkout) {
      return ItemStatus.CHECKED_OUT;
    }
    if (this.order_item) {
      return ItemStatus.ORDERED;
    }
    return ItemStatus.AVAILABLE;
  }
}
