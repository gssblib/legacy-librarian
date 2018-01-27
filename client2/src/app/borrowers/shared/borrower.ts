import { ItemCheckout } from "./borrowers.service";

export class Borrower {
  borrowernumber: number;
  firstname: string;
  surname: string;
  contactname: string;
  items: ItemCheckout[];
  fees: any;
}
