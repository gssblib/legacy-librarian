import { ItemCheckout } from "./borrowers.service";

export class Borrower {
  borrowernumber: number;
  firstname: string;
  surname: string;
  contactname: string;
  items: ItemCheckout[];
  fees: any;

  get fullName(): string {
    return `${this.surname}, ${this.firstname}, ${this.contactname}`;
  }

  get studentNames(): string {
    return `${this.surname}, ${this.firstname}`;
  }
}
