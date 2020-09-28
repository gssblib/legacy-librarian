import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Borrower } from './borrower';
import { BorrowersService } from "./borrowers.service";
import { ModelService } from "../../core/model.service";
import { Observable } from "rxjs";

/**
 * Manages the single borrower whose information is shown in the borrower views.
 *
 * All borrower views watch the observable in this service, and changes to the borrower
 * (reloading the data from the server) are published to this service.
 */
@Injectable()
export class BorrowerService extends ModelService<Borrower> {

  constructor(private rpc: RpcService, private borrowersService: BorrowersService) {
    super(borrowersService, {options: 'items,orders,fees'});
  }

  renewAll(): Observable<Object> {
    return this.rpc.httpPost('borrowers/' + this.get().borrowernumber + '/renewAllItems');
  };

  payFees(): Observable<Object> {
    return this.rpc.httpPost('borrowers/' + this.get().borrowernumber + '/payFees');
  };

  payFee(item): Observable<Object> {
    if (item.type === 'checkouts') {
      return this.rpc.httpPost('checkouts/' + item.barcode + '/payFee');
    } else {
      return this.rpc.httpPost('history/' + item.id + '/payFee');
    }
  };

  waiveFee = this.payFee;
}
