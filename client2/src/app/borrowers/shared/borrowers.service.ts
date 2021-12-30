import { Injectable } from '@angular/core';
import { RpcService } from '../../core/rpc.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Borrower, BorrowerEmail, BorrowerReminder} from './borrower';
import { FormService } from '../../core/form.service';
import { Item } from '../../items/shared/item';
import { TableFetchResult } from '../../core/table-fetcher';

import { DateService } from "../../core/date-service";
import { ModelsService } from "../../core/models.service";

/**
 * Information about a checked-out item as contained in the borrower information
 * returned by the server.
 */
export class ItemCheckout extends Item {
  borrowernumber: number;
  checkout_date: string;
  date_due: string;

  get checkoutDate(): Date {
    return new Date(this.checkout_date);
  }

  get dueDate(): Date {
    return new Date(this.date_due);
  }

  get overdue(): boolean {
    return this.dueDate < DateService.addDays(new Date(), -1);
  }
}

/**
 * Borrower functions talking to the server.
 */
@Injectable()
export class BorrowersService extends ModelsService<Borrower> {

  constructor(rpc: RpcService, formService: FormService) {
    super('borrowers', borrower => borrower.borrowernumber, rpc, formService);
  }

  newBorrower(): Borrower {
    const borrower = new Borrower();
    borrower.state = 'ACTIVE';
    return borrower;
  }

  toModel(row: any): Borrower {
    const borrower = Object.assign(new Borrower(), row);
    if (borrower.items) {
      borrower.items = borrower.items.map(checkout => Object.assign(new ItemCheckout(), checkout));
    }
    return borrower;
  }

  getBorrowerReminders(borrowerNumber: number, params: any): Observable<TableFetchResult<BorrowerEmail>> {
    return this.rpc.httpGet(`borrowers/${borrowerNumber}/reminders`, {...params, returnCount: true})
      .pipe(map(result => new TableFetchResult(result.rows, result.count)));
  }

  generateReminders(): Observable<BorrowerReminder[]> {
    return this.rpc.httpGet('borrowers/reminders');
  }

  sendReminders(): Observable<BorrowerReminder[]> {
    return this.rpc.httpPost('borrowers/sendReminders');
  }

  getBorrowerHistory(id: number, params: any): Observable<TableFetchResult<ItemCheckout>> {
    return this.rpc.httpGet(`borrowers/${id}/history`, params)
      .pipe(map(result => new TableFetchResult(result.rows, result.count)));
  }

  checkOutItem(barcode: string, borrowerNumber: number) {
    return this.rpc.httpPost('items/' + barcode + '/checkout', {borrower: borrowerNumber});
  }

  orderItem(barcode: string, borrowerNumber: number) {
    return this.rpc.httpPost(`items/${barcode}/order`, {borrower: borrowerNumber});
  }

  removeOrderedItem(borrowerNumber: number, orderId: number, itemId: number) {
    const resourcePath = `borrowers/${borrowerNumber}/orders/${orderId}/items/${itemId}`;
    return this.rpc.httpDelete(resourcePath);
  }

  getReminder(borrowerNumber: number): Observable<BorrowerReminder> {
    return this.rpc.httpGet(`borrowers/${borrowerNumber}/reminder`);
  }

  sendReminder(borrowerNumber: number) {
    return this.rpc.httpPost(`borrowers/${borrowerNumber}/sendReminder`);
  }

  getMyBorrower() {
    return this.rpc.httpGet('me').pipe(map(obj => this.toModel(obj)));
  }
}
