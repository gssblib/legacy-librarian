import { Checkout } from "./checkout";
import { ItemState } from "./item-state";
/**
 * Represents an item (as stored in the database).
 */
export class Item {
  id: number;
  barcode: string;
  author: string;
  title: string;
  description: string;
  subject: string;
  publicationyear: number;
  publishercode: string;
  age: string;
  media: string;
  serial: string;
  seriestitle: string;
  classification: string;
  isbn10: string;
  isbn13: string;
  state: ItemState;
  checkout?: Checkout;
  history: Array<any>;

  get status(): ItemState {
    return this.state === ItemState.CIRCULATING
        ? this.checkout ? ItemState.CHECKED_OUT : ItemState.AVAILABLE
        : this.state;
  }
}
