import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'
import { RpcService } from '../core/rpc.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableFetchResult } from '../core/table-fetcher';

export class Fee {
  surname: string;
  fee: number;
  newFee: number;
  oldFee: number;
}

/**
 * Service for fetching and updating fees.
 */
@Injectable()
export class FeesService {

  constructor(private rpc: RpcService,
              private datePipe: DatePipe) {}

  getFees(criteria, offset, limit, returnCount): Observable<TableFetchResult<Fee>> {
    return this.rpc.fetch('fees', criteria, offset, limit, returnCount)
      .pipe(map(result => new TableFetchResult(result.rows, result.count)));
  }

  updateFees(date) {
    var dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
    return this.rpc.httpPost('checkouts/updateFees', {date: dateStr});
  }
}
