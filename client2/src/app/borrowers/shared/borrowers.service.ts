import { Injectable } from '@angular/core';
import { RpcService } from '../../core/rpc.service';
import { Observable } from 'rxjs';
import { Borrower } from './borrower';
import { FetchResult } from '../../core/fetch-result';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Column, FormService, ViewFormField } from '../../core/form.service';
import { Item } from '../../items/shared/item';
import { Checkout } from '../../items/shared/checkout';
import { TableFetchResult } from '../../core/table-fetcher';
import 'rxjs/add/operator/do';

export type ItemCheckout = Item & Checkout;

/**
 * Borrower functions talking to the server.
 */
@Injectable()
export class BorrowersService {
  /** Cached field fetched from server. */
  private cols: Column[];

  constructor(private rpc: RpcService, private formService: FormService) {
  }

  getColumns(): Observable<Column[]> {
    return this.cols
      ? Observable.of(this.cols)
      : this.rpc.httpGet('borrowers/fields').do(cols => this.cols = cols);
  }

  /**
   * Returns the formly form fields for the borrower details page.
   *
   * @param selected Keys of the fields to return (in this order)
   */
  getBorrowerFields(selected?: string[]): Observable<FormlyFieldConfig[]> {
    return this.getColumns().map(cols => this.formService.formlyFields(cols, selected));
  }

  /**
   * Returns the read-only form fields for the borrower details page.
   *
   * @param selected Names of the fields to return (in this order)
   */
  getViewFields(selected?: string[]): Observable<ViewFormField[]> {
    return this.getColumns().map(cols => this.formService.viewFormFields(cols, selected));
  }

  /**
   * Gets a single Borrower identified by id (borrowernumber).
   */
  getBorrower(id: number, params?): Observable<Borrower> {
    return this.rpc.httpGet('borrowers/' + id, params)
        .map(obj => Object.assign(new Borrower(), obj));
  }

  getBorrowerHistory(id: number, params: any) : Observable<TableFetchResult<ItemCheckout>> {
    return this.rpc.httpGet(`borrowers/${id}/history`, params)
      .map(result => new TableFetchResult(result.rows, result.count));
  }

  getBorrowers(criteria, offset, limit, returnCount): Observable<FetchResult> {
    return this.rpc.fetch('borrowers', criteria, offset, limit, returnCount);
  }

  checkOutItem(barcode, borrowerNumber) {
    return this.rpc.httpPost('items/' + barcode + '/checkout', {borrower: borrowerNumber});
  }

  addBorrower(borrower): Observable<Borrower> {
    const storedBorrower = Object.assign({}, borrower);
    return this.rpc.httpPost('borrowers', storedBorrower)
      .map(obj => Object.assign(new Borrower(), obj));
  }

  saveBorrower(borrower) {
    const storedBorrower = Object.assign({}, borrower);
    return this.rpc.httpPut('borrowers', storedBorrower)
      .map(obj => Object.assign(new Borrower(), obj));
  }

  deleteBorrower(borrower) {
    return this.rpc.httpDelete(`borrowers/${borrower.borrowernumber}`);
  }

  getMyBorrower() {
    return this.rpc.httpGet('me')
        .map(obj => Object.assign(new Borrower(), obj));
  }
}
