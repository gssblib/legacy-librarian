import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Borrower } from './borrower';
import { Subject } from "rxjs/Subject";
import { BorrowersService } from "./borrowers.service";

/**
 * Manages the single borrower whose information is shown in the borrower views.
 *
 * All borrower views watch the observable in this service, and changes to the borrower
 * (reloading the data from the server) are published to this service.
 */
@Injectable()
export class BorrowerService {
  /** Current borrower. */
  private borrower?: Borrower = null;

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

  getBorrower(): Borrower|null {
    return this.borrower;
  }

  /**
   * Loads the borrower with the given borrowernumber from the server and publishes
   * the change.
   */
  loadBorrower(borrowernumber: number) {
    this.borrowersService.get(borrowernumber, {options: 'items,fees'})
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

  renewAll() {
    return this.rpc.httpPost(
      'borrowers/' + this.borrower.borrowernumber + '/renewAllItems');
  };

  payFees() {
    return this.rpc.httpPost(
      'borrowers/' + this.borrower.borrowernumber + '/payFees');
  };

  payFee(item) {
    if (item.type === 'checkouts') {
      return this.rpc.httpPost(
        'checkouts/' + item.barcode + '/payFee');
    } else {
      return this.rpc.httpPost('history/' + item.id + '/payFee');
    }
  };

  waiveFee = this.payFee;
}
