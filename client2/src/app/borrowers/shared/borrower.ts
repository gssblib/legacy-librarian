import { ItemCheckout } from "./borrowers.service";
import { Order } from "../../orders/shared/order";

export class Borrower {
  borrowernumber: number;
  firstname: string;
  surname: string;
  contactname: string;
  state: string;
  items: ItemCheckout[];
  fees: any;
  orders: Order[];
  order?: Order;

  get fullName(): string {
    return `${this.surname}, ${this.firstname}, ${this.contactname}`;
  }

  get studentNames(): string {
    return `${this.surname}, ${this.firstname}`;
  }
}

export interface BorrowerEmail {
  id: number;
  borrower_id: number;
  recipient: string;
  send_time: Date|string;
  email_text: string;
}

/**
 * Results of reminder generation.
 */
export enum BorrowerReminderResultCode {
  OK = 'OK',
  /**
   * Email skipped because borrower has no items checked out and no outstanding
   * fees.
   */
  NO_ITEMS_OR_FEES = 'NO_ITEMS_OR_FEES',

  /**
   * Email skipped because borrower has no email address.
   */
  NO_EMAIL_ADDRESS = 'NO_EMAIL_ADDRESS',

  /**
   * Email skipped because an email has already been sent within the last 24
   * hours.
   */
  EXISTING_EMAIL_IN_WINDOW = 'EXISTING_EMAIL_IN_WINDOW',
}

/**
 * Data used to generate an email (such as the reminder emails).
 */
export interface Email {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/**
 * Reminder data as returned by backend.
 */
export interface BorrowerReminder {
  resultCode: BorrowerReminderResultCode;
  borrower: Borrower;
  email?: Email;
}
