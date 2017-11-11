import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Borrower } from './borrower';
import { Subject } from "rxjs/Subject";
import { BorrowersService } from "./borrowers.service";

@Injectable()
export class BorrowerService {
  /** Current borrower. */
  private borrower: Borrower;

  /** Subject tracking the current borrower. */
  private borrowerSubject = new Subject<Borrower>();

  /** Observable that any borrower page can listen to. */
  borrowerObservable = this.borrowerSubject.asObservable();

  constructor(private rpc: RpcService, private borrowersService: BorrowersService) {
    this.borrowerObservable.subscribe(borrower => this.borrower = borrower);
  }

  /**
   * Publishes the change to the given borrower.
   */
  setBorrower(borrower: Borrower) {
    this.borrowerSubject.next(borrower);
  }

  getBorrower(): Borrower {
    return this.borrower;
  }

  /**
   * Loads the borrower with the given borrowernumber from the server and publishes
   * the change.
   */
  loadBorrower(borrowernumber: number) {
    this.borrowersService.getBorrower(borrowernumber, {options: 'items,fees'})
      .subscribe(this.setBorrower.bind(this));
  }

  /**
   * Reloads the current borrower from the server and publishes the change.
   */
  reloadBorrower() {
    if (this.borrower) {
      this.loadBorrower(this.borrower.borrowernumber);
    }
  }

  payFees() {
    return this.rpc.httpPost(
      '/borrowers/' + this.borrower.borrowernumber + '/payFees');
  };

  payFee(item) {
    if (item.type === 'checkouts') {
      return this.rpc.httpPost(
        '/checkouts/' + item.barcode + '/payFee');
    } else {
      return this.rpc.httpPost('/history/' + item.id + '/payFee');
    }
  };

  waiveFee = this.payFee;
}
