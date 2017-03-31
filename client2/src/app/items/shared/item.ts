/**
 * Represents an item (as stored in the database).
 */
export class Item {
  barcode: string;
  author: string;
  title: string;
  description: string;
  publicationyear: number;
  publishercode: string;
  state: string;
  subject: string;
}
