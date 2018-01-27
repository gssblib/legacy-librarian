
export class Checkout {
  barcode: string;
  borrowernumber: number;
  checkout_date: string;
  date_due: string;

  get checkoutDate(): Date {
    return new Date(this.checkout_date);
  }
}
