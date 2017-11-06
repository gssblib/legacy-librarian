import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common'
import { RpcService } from "../core/rpc.service";

/**
 * Service for fetching and updating fees.
 */
@Injectable()
export class FeesService {

  constructor(private rpc: RpcService,
              private datepipe: DatePipe) {}

  getFees() {
    return this.rpc.httpGet('/borrowers/fees');
  }

  updateFees(date) {
    var dateStr = this.datepipe.transform(date, 'yyyy-MM-dd');
    return this.rpc.httpPost('/checkouts/updateFees', {date: dateStr});
  }

}
