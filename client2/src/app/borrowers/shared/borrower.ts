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

  get fullName(): string {
    return `${this.surname}, ${this.firstname}, ${this.contactname}`;
  }

  get studentNames(): string {
    return `${this.surname}, ${this.firstname}`;
  }
}
