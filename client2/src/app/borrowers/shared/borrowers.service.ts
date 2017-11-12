import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Observable } from "rxjs";
import { Borrower } from "./borrower";
import { FetchResult } from "../../core/fetch-result";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Column, FormService } from "../../core/form.service";

/**
 * Borrower functions talking to the server.
 */
@Injectable()
export class BorrowersService {
  /** Cached field fetched from server. */
  private cols: Column[];

  constructor(private rpc: RpcService, private formService: FormService) {
  }

  /**
   * Returns the formly form fields for the borrower details page.
   *
   * @param selected Keys of the fields to return (in this order)
   */
  getBorrowerFields(selected?: string[]): Observable<FormlyFieldConfig[]> {
    if (this.cols) {
      return Observable.of(this.formService.formlyFields(this.cols, selected));
    }
    return this.rpc.httpGet('borrowers/fields')
      .map((cols: any) => {
        this.cols = cols;
        return this.formService.formlyFields(this.cols, selected);
      });
  }

  /**
   * Gets a single Borrower identified by id (borrowernumber).
   */
  getBorrower(id: number, params?): Observable<Borrower> {
    return this.rpc.httpGet('borrowers/' + id, params)
        .map(obj => Object.assign(new Borrower(), obj));
  }

  getBorrowers(criteria, offset, limit, returnCount): Observable<FetchResult> {
    return this.rpc.fetch('borrowers', criteria, offset, limit, returnCount);
  }

  checkOutItem(barcode, borrowerNumber) {
    return this.rpc.httpPost('items/' + barcode + '/checkout', {borrower: borrowerNumber});
  }

  addBorrower(borrower): Observable<Borrower> {
    const storedBorrower = Object.assign({}, borrower);
    return this.rpc.httpPost('/borrowers', storedBorrower)
      .map(obj => Object.assign(new Borrower(), obj));
  }

  saveBorrower(borrower) {
    const storedBorrower = Object.assign({}, borrower);
    return this.rpc.httpPut('/borrowers', storedBorrower)
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
