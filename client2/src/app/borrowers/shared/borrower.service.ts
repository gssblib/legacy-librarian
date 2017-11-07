import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Borrower } from './borrower';

@Injectable()
export class BorrowerService {
  borrower: Borrower;

  constructor(private rpc: RpcService) {
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
